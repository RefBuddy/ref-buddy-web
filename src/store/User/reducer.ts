/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  getUserCalendarEvents,
  getOfficialsStats,
  getAllOfficialsCalendarEvents
} from './actions';

export interface ResolvedGame {
  [key: string]: any; 
}

interface BlockedTimes {
  endTime: string;
  notes: string;
  startTime: string;
}

export interface UserState {
  user?: User;
  loading: boolean;
  error: any;
  assignedGames?: {
    [key: string]: ResolvedGame[];
  };
  queuedGames?: {
    [key: string]: ResolvedGame[];
  };
  blockedOffTimes?: {
    [key: string]: any; 
  };
  userDocData: {}; 
  officialsStats?: OfficialStats | null; 
  userGames: {};
  officialsCalendarData: {}; 
}

const initialState = {
  user: undefined,
  loading: false,
  error: null,
  officialsStats: null,
  officialsCalendarData: {},
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
      state.queuedGames = payload.queuedGames;
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
      state.officialsStats = payload;
      state.error = false;
      state.loading = false;
    });    
    builder.addCase(getOfficialsStats.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(getAllOfficialsCalendarEvents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllOfficialsCalendarEvents.fulfilled, (state, { payload }) => {
      state.officialsCalendarData = payload;
      state.error = false;
      state.loading = false;
    });    
    builder.addCase(getAllOfficialsCalendarEvents.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
