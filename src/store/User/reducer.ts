/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { fetchSelf } from './actions';

interface UserState {
  user?: User;
  loading: boolean;
  error: any;
}

const initialState = {
  user: undefined,
  loading: false,
  error: null,
} as UserState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSelf.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSelf.fulfilled, (state, { payload }) => {
      state.user = payload;
      state.error = false;
      state.loading = false;
    });
    builder.addCase(fetchSelf.rejected, (state, { error }) => {
      state.error = true;
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
