/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  getUserCalendarEvents,
  getOfficialsStats,
  getAllOfficialsCalendarEvents,
  getUserLeagues,
  updateOfficialRole,
  deleteUser,
  inviteUser,
} from './actions';

export interface ResolvedGame {
  [key: string]: any;
}

interface BlockedTimes {
  endTime: string;
  notes: string;
  startTime: string;
}

const league = '';
const season = '2023-2024';

const initialState = {
  user: undefined,
  loading: false,
  error: null,
  officialsStats: null,
  officialsCalendarData: {},
  currentLeague: league,
  currentSeason: season,
} as UserState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentSeason: (state, { payload }) => {
      state.currentSeason = payload;
    },
    setCurrentLeague: (state, { payload }) => {
      state.currentLeague = payload;
    },
  },
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
    builder.addCase(
      getAllOfficialsCalendarEvents.fulfilled,
      (state, { payload }) => {
        state.officialsCalendarData = payload;
        state.error = false;
        state.loading = false;
      },
    );
    builder.addCase(
      getAllOfficialsCalendarEvents.rejected,
      (state, { error }) => {
        state.error = error;
        state.loading = false;
      },
    );
    builder.addCase(getUserLeagues.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserLeagues.fulfilled, (state, { payload }) => {
      state.currentLeague = payload.leagues[0];
      state.error = false;
      state.loading = false;
    });
    builder.addCase(getUserLeagues.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(updateOfficialRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOfficialRole.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
    });
    builder.addCase(updateOfficialRole.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
    });
    builder.addCase(deleteUser.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
    builder.addCase(inviteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(inviteUser.fulfilled, (state, { payload }) => {
      state.error = false;
      state.loading = false;
    });
    builder.addCase(inviteUser.rejected, (state, { error }) => {
      state.error = error;
      state.loading = false;
    });
  },
});

export const { setCurrentSeason, setCurrentLeague } = userSlice.actions;

export default userSlice.reducer;
