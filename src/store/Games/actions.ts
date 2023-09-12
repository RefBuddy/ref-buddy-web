import { createAsyncThunk } from '@reduxjs/toolkit';

const URL = process.env.GATSBY_API_URL;
// _ signifies just a void value, we don't need to pass anything in
export const fetchGamesByMonth = createAsyncThunk(
  'games/fetchGamesByMonth',
  async (_, { rejectWithValue, getState }) => {
    // get games state from our global redux store
    const { games } = getState() as { games: GamesState };
    const { user } = getState() as { user: UserState };
    // set the default
    try {
      const data = {
        data: {
          Date: games.currentDate,
          league: user.currentLeague,
          season: user.currentSeason,
        },
      };

      const response = await fetch(`${URL}/getAdminMonth`, {
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
      // If its anything but a unauthorized error, throw it
      if (typedErr.response.status !== 401) {
        return rejectWithValue(
          `HTTP Error! Status: ${typedErr.response.status}`,
        );
      }
    }
  },
);

export const fetchOfficialsProfiles = createAsyncThunk(
  'games/fetchOfficialsProfiles',
  async (officialsData: OfficialsKeyRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: {
          officials: officialsData.officials,
        },
      };

      const response = await fetch(`${URL}/getOfficialsProfiles`, {
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
      if (typedErr.response.status !== 401) {
        return rejectWithValue(
          `HTTP Error! Status: ${typedErr.response.status}`,
        );
      }
    }
  },
);

export const editGameDate = createAsyncThunk(
  'games/editGameDate',
  async (gameData: GameDateRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: gameData,
      };

      const response = await fetch(`${URL}/editGameDate`, {
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
      if (typedErr.response.status !== 401) {
        return rejectWithValue(
          `HTTP Error! Status: ${typedErr.response.status}`,
        );
      }
    }
  },
);

export const addToQueue = createAsyncThunk(
  'games/addToQueue',
  async (gameData: AssignGameRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: gameData,
      };

      const response = await fetch(`${URL}/addToQueue`, {
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

export const removeFromGame = createAsyncThunk(
  'games/removeFromGame',
  async (gameData: RemoveGameRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: gameData,
      };

      const response = await fetch(`${URL}/removeFromGame`, {
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

export const addGame = createAsyncThunk(
  'games/addGame',
  async (gameData: AddGameRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: gameData,
      };

      const response = await fetch(`${URL}/addGame`, {
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

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (gameData: DeleteGameRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: gameData.officials,
      };

      const response = await fetch(`${URL}/deleteGame`, {
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
