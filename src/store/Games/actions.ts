import { createAsyncThunk } from '@reduxjs/toolkit';
import { formatDate } from '../../utils/helpers';

const URL = process.env.GATSBY_API_URL;
// _ signifies just a void value, we don't need to pass anything in
export const fetchGamesByMonth = createAsyncThunk('games/fetchGamesByMonth', async (_, { rejectWithValue, getState }) => {
  // get games state from our global redux store
  const { games } = getState() as { games: GamesState };
  // set the default
  let currentDate = new Date();
  if (games.currentDate) {
    currentDate = games.currentDate;
  }
  try {
    const data = {
      data: {
        Date: formatDate(currentDate),
        league: games.currentLeague,
        season: games.currentSeason,
      }
    };

    const response = await fetch(`${URL}/getAdminMonth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const json = await response.json();
      return json.data;
    } else {
      return rejectWithValue(`HTTP error! Status: ${response.status}`)
    }
  } catch (err) {
    const typedErr: any = err;
    // If its anything but a unauthorized error, throw it
    if (typedErr.response.status !== 401) {
      return rejectWithValue(`HTTP Error! Status: ${typedErr.response.status}`)
    }
  }
  
});
