import { createSlice } from '@reduxjs/toolkit';
import { getListOfOfficials } from './actions';

const initialState = {
  officialsList: [],
  loading: false,
  error: undefined
} as ListOfOfficialsState;

export const officialsSlice = createSlice({
  name: 'officials',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getListOfOfficials.fulfilled, (state, { payload }) => {
      state.officialsList = payload;
      state.error = null;
      state.loading = false;
    });
  },
})

export default officialsSlice.reducer;
