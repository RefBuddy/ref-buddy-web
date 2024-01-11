import { createSlice } from '@reduxjs/toolkit';
import { getLeagueStats } from './actions';

const initialState = {
  stats: {},
  loading: false,
  error: undefined,
} as StatsState;

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLeagueStats.fulfilled, (state, { payload }) => {
      state.stats = payload.stats;
      state.error = null;
      state.loading = false;
    });
  },
});

export default statsSlice.reducer;
