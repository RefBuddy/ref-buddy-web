import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    incrementQueueCount: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      if (state.officialsList[uid]) {
        state.officialsList[uid].queueCount = (state.officialsList[uid].queueCount || 0) + 1;
      }
    },
    incrementAssignedCount: (state, action: PayloadAction<string[]>) => {
      const uids = action.payload;
      uids.forEach(uid => {
        if (state.officialsList[uid]) {
          state.officialsList[uid].assignedCount = (state.officialsList[uid].assignedCount || 0) + 1;
          state.officialsList[uid].queueCount = (state.officialsList[uid].queueCount || 0) - 1;
        }
      }
      )
    },
    decrementCount: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      if (state.officialsList[uid]) {
        // Use optional chaining to safely access properties
        const queueCount = state.officialsList[uid]?.queueCount || 0;
        const assignedCount = state.officialsList[uid]?.assignedCount || 0;
    
        if (queueCount > 0) {
          state.officialsList[uid].queueCount = queueCount - 1;
        } else {
          state.officialsList[uid].assignedCount = assignedCount - 1;
        }
      }
    }    
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

export const {
  incrementQueueCount,
  incrementAssignedCount,
  decrementCount
} = officialsSlice.actions;

export default officialsSlice.reducer;
