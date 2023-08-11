import { createSlice } from '@reduxjs/toolkit';
import { fetchGamesByMonth, fetchOfficialsProfiles, addToQueue, removeFromGame, addGame } from './actions';
import { formatDate } from '../../utils/helpers';
import { releaseGame } from '../Assigning/actions';

const league = 'bchl'; 
const season = '2023-2024';

const initialState = {
  monthGameData: {},
  officialsData: {},
  loading: false,
  error: undefined,
  currentDate: formatDate(new Date()),
  currentLeague: league,
  currentSeason: season,
  selectedEvent: undefined,
  selectedGames: [],
  savedNewGame: false,
  refetchCalendarEvents: false,
} as GamesState;

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setSelectedEvent: (state, { payload }) => {
      state.selectedEvent = payload;
    },
    setCurrentDate: (state, { payload }) => {
      state.currentDate = payload;
    },
    setCurrentSeason: (state, { payload }) => {
      state.currentSeason = payload;
    },
    setCurrentLeague: (state, { payload }) => {
      state.currentLeague = payload;
    },
    setSelectedGames: (state, { payload }) => {
      state.selectedGames = payload;
    },
    editGameDate: (state, { payload }) => {
      const { gameId, newDate, newISO } = payload;
      const gameIndex = state.selectedGames.findIndex(game => game.id === gameId);
      if (gameIndex !== -1) {
        const updatedGame: GameData = {
          ...state.selectedGames[gameIndex],
          date: newDate,
          time: newISO,
        };
        state.selectedGames[gameIndex] = updatedGame;
      }
    },
    resetSavedGameState: (state) => {
      state.savedNewGame = false;
    },
    resetCalendarEventsFetch: (state) => {
      state.refetchCalendarEvents = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGamesByMonth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGamesByMonth.fulfilled, (state, { payload }) => {
      state.monthGameData = payload;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchGamesByMonth.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
 
    builder.addCase(fetchOfficialsProfiles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOfficialsProfiles.fulfilled, (state, { payload, meta }) => {
      state.officialsData = {
        ...state.officialsData,
        [meta.arg.gameId]: payload,
      };
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchOfficialsProfiles.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(addToQueue.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToQueue.fulfilled, (state, { payload, meta }) => {
      state.error = null;
      state.loading = false;
      state.refetchCalendarEvents = true;
      if (payload) {
        const gameIndex = state.selectedGames.findIndex(game => game.gameNumber === meta.arg.gameNumber);
        state.selectedGames[gameIndex].officials = payload.updatedOfficials;
        state.selectedGames[gameIndex].queue = true;
      }
    });
    builder.addCase(releaseGame.fulfilled, (state, { meta }) => {
      const gameIndex = state.selectedGames.findIndex(game => game.gameNumber === meta.arg.gameNumber);
      if (gameIndex !== -1 && state.selectedGames[gameIndex]?.queue) {
          state.selectedGames[gameIndex].queue = false;
      }
    });  
    builder.addCase(addToQueue.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(removeFromGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromGame.fulfilled, (state, { payload, meta }) => {
      state.error = null;
      state.loading = false;
      state.refetchCalendarEvents = true
      if (payload) {
        const gameIndex = state.selectedGames.findIndex(game => game.gameNumber === meta.arg.gameNumber);
        const officialIndex = state.selectedGames[gameIndex].officials.findIndex(official => official.uid === meta.arg.uid);
        
        if (officialIndex !== -1) {
          state.selectedGames[gameIndex].officials.splice(officialIndex, 1);
        }
      }
    });
    builder.addCase(removeFromGame.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(addGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addGame.fulfilled, (state, { payload, meta }) => {
      state.error = null;
      state.loading = false;

      if (payload) {
        // const gameIndex = state.selectedGames.findIndex(game => game.gameNumber === meta.arg.gameNumber);
        // state.selectedGames[gameIndex].officials = payload.updatedOfficials;
        state.savedNewGame = true;
      }
    });
    builder.addCase(addGame.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
  },
});

export const {
  setCurrentDate,
  setCurrentSeason,
  setCurrentLeague,
  setSelectedEvent,
  setSelectedGames,
  editGameDate,
  resetSavedGameState,
  resetCalendarEventsFetch,
} = gamesSlice.actions;

export default gamesSlice.reducer;