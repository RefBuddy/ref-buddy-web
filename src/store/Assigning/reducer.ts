import { createSlice } from '@reduxjs/toolkit';
import { releaseGame } from './actions';

const initialState = {
  assigningStatus: false,
  loading: false,
  releaseSuccessful: false,
  error: null,
} as AssigningState;

export const assigningSlice = createSlice({
  name: 'assigning',
  initialState,
  reducers: {
    setAssigningStatus: (state, { payload }) => {
      state.assigningStatus = payload;
    },
    setReleaseSuccessful: (state, { payload }) => {
      state.releaseSuccessful = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(releaseGame.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(releaseGame.fulfilled, (state) => {
      // state.assigningStatus = false;
      state.loading = false;
      state.releaseSuccessful = true;
    });
    builder.addCase(releaseGame.rejected, (state) => {
      // state.assigningStatus = false;
      state.loading = false;
      state.error = `There was an error releasing the game`;
    });
  },
})

export const { setAssigningStatus, setReleaseSuccessful } = assigningSlice.actions;

export default assigningSlice.reducer;
