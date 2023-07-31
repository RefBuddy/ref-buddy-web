import { createAsyncThunk } from '@reduxjs/toolkit';

const URL = process.env.GATSBY_API_URL;

export const getOfficialsList = createAsyncThunk(
    'officials/getOfficialsList',
    async (leagueData: {league: string}, { rejectWithValue }) => {
      try {
        const data = {
          data: leagueData
        };
  
        const response = await fetch(`${URL}/getListOfOfficials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
  
        if (response.ok) {
          const json = await response.json();
          if (json.data['officials'] == null) {
            return {};
          }
          return json.data;
        } else {
          return rejectWithValue(`HTTP error! Status: ${response.status}`);
        }
      } catch (err) {
        const typedErr: any = err;
        if (typedErr.response.status !== 401) {
          return rejectWithValue(`HTTP Error! Status: ${typedErr.response.status}`)
        }
      }
    }
  );