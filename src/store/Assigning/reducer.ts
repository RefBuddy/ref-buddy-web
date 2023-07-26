import { createSlice } from '@reduxjs/toolkit';
import { releaseGame } from './actions';

const initialState = {
  assigningStatus: false,
  loading: false,
} as AssigningState;

export const assigningSlice = createSlice({
  name: 'assigning',
  initialState,
  reducers: {
    setAssigningStatus: (state, { payload }) => {
      state.assigningStatus = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(releaseGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(releaseGame.fulfilled, (state) => {
      // state.assigningStatus = false;
      state.loading = false;
    });
    builder.addCase(releaseGame.rejected, (state) => {
      // state.assigningStatus = false;
      state.loading = false;
    });
  },
})

export const { setAssigningStatus } = assigningSlice.actions;

export default assigningSlice.reducer;
