import { createSlice } from '@reduxjs/toolkit';
import { getOfficialsList } from './actions';

const initialState = {
  officialsList: {},
  supervisorsList: {},
  loading: false,
  error: undefined
} as OfficialsListState;

export const officialsSlice = createSlice({
  name: 'officials',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getOfficialsList.fulfilled, (state, { payload }) => {
      state.officialsList = payload.officials;
      state.supervisorsList = payload.supervisors;
      state.error = null;
      state.loading = false;
    });
  },
})

export default officialsSlice.reducer;
