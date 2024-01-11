import { createAsyncThunk } from '@reduxjs/toolkit';

const URL = process.env.GATSBY_API_URL;

interface StatsInput {
  league: string;
  season: string;
}

export const getLeagueStats = createAsyncThunk(
  'stats/getOfficialsStats',
  async (data: StatsInput, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/getLeagueStats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      }
      return rejectWithValue(`HTTP error! Status: ${response.status}`);
    } catch (err) {
      const typedErr: any = err;
      if (typedErr.response.status !== 401) {
        return rejectWithValue(
          `HTTP Error! Status: ${typedErr.response.status}`,
        );
      }
    }
  },
);
