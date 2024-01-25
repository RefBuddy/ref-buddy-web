import { createAsyncThunk } from '@reduxjs/toolkit';

const URL = process.env.GATSBY_API_URL;

interface StatsInput {
  league: string;
  season: string;
}

const cache = new Map();

export const getLeagueStats = createAsyncThunk(
  'stats/getOfficialsStats',
  async (data: StatsInput, { rejectWithValue }) => {
    if (cache.has(data)) {
      return cache.get(data);
    }
    try {
      const response = await fetch(`${URL}/getLeagueStats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        cache.set(data, responseData);
        return responseData;
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
