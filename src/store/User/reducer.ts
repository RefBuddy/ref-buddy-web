/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getUserCalendarEvents, getOfficialsStats } from './actions';

export interface ResolvedGame {
  [key: string]: any; 
}

export interface UserState {
  user?: User;
  loading: boolean;
  error: any;
  assignedGames?: {
    [key: string]: ResolvedGame[];
  };
  blockedOffTimes?: {
    [key: string]: any; 
  };
  userDocData: {}; 
  officialsStats: {}; 
  userGames: {}; 
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
    builder.addCase(getUserCalendarEvents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserCalendarEvents.fulfilled, (state, { payload }) => {
      state.assignedGames = payload.assignedGames;
      state.blockedOffTimes = payload.blockedOffTimes;
      state.error = false;
      state.loading = false;
    });
    builder.addCase(getUserCalendarEvents.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(getOfficialsStats.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOfficialsStats.fulfilled, (state, { payload }) => {
      state.officialsStats = payload.data;
      state.error = false;
      state.loading = false;
    });    
    builder.addCase(getOfficialsStats.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
