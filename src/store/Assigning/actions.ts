import { createAsyncThunk } from '@reduxjs/toolkit';

const URL = process.env.GATSBY_API_URL;

export const releaseGame = createAsyncThunk(
  'games/releaseGame',
  async (gameData: ReleaseGameRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: gameData,
      };

      const response = await fetch(`${URL}/releaseGame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const json = await response.json();
        return json.data;
      } else {
        return rejectWithValue(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      const typedErr: any = err;
      if (typedErr.response && typedErr.response.status !== 401) {
        return rejectWithValue(
          `HTTP Error! Status: ${typedErr.response.status}`,
        );
      } else {
        return rejectWithValue(
          `Unexpected error occurred: ${typedErr.message}`,
        );
      }
    }
  },
);
