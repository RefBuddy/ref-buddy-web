import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assigningStatus: false,
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
    
  },
})

export const { setAssigningStatus } = assigningSlice.actions;

export default assigningSlice.reducer;
