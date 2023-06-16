import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSelf = createAsyncThunk<any>('user/fetchSelf', async () => {
  // Get user from api
});
