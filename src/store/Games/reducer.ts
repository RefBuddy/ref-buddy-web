import { createSlice } from '@reduxjs/toolkit';
import { fetchGamesByMonth, fetchOfficialsProfiles, assignToGame, addGame } from './actions';
import { formatDate } from '../../utils/helpers';
import { add } from 'date-fns';

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
    builder.addCase(assignToGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(assignToGame.fulfilled, (state, { payload, meta }) => {
      state.error = null;
      state.loading = false;

      if (payload) {
        const gameIndex = state.selectedGames.findIndex(game => game.gameNumber === meta.arg.gameNumber);
        state.selectedGames[gameIndex].officials = payload.updatedOfficials;
      }
    });
    builder.addCase(assignToGame.rejected, (state, { error }) => {
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
        console.log(payload);
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
} = gamesSlice.actions;

export default gamesSlice.reducer;