import { createSlice } from '@reduxjs/toolkit';
import { fetchGamesByMonth, fetchOfficialsProfiles } from './actions';
import { formatDate } from '../../utils/helpers';

const league = 'bchl'; 
const season = '2022-2023';

const initialState = {
  monthGameData: undefined,
  officialsData: undefined,
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
    builder.addCase(fetchOfficialsProfiles.fulfilled, (state, { payload }) => {
      state.officialsData = payload;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchOfficialsProfiles.rejected, (state, { error }) => {
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
  setSelectedGames
} = gamesSlice.actions;

export default gamesSlice.reducer;