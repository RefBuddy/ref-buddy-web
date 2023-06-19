import { createSlice } from '@reduxjs/toolkit';
import { fetchGamesByMonth } from './actions';

const league = 'bchl'; 
const season = '2022-2023';

const initialState = {
  monthGameData: undefined,
  loading: false,
  error: undefined,
  currentDate: new Date(),
  currentLeague: league,
  currentSeason: season,
  selectedEvent: undefined,
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
  },
});

export const {
  setCurrentDate,
  setCurrentSeason,
  setCurrentLeague,
  setSelectedEvent
} = gamesSlice.actions;

export default gamesSlice.reducer;