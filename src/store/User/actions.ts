import { createAsyncThunk } from '@reduxjs/toolkit';

const URL = process.env.GATSBY_API_URL;

export const getUserCalendarEvents = createAsyncThunk(
  'user/getUserCalendarEvents',
  async (uidData: UIDRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: uidData,
      };

      const response = await fetch(`${URL}/getUserCalendarEvents`, {
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

export const getAllOfficialsCalendarEvents = createAsyncThunk(
  'user/getAllOfficialsCalendarEvents',
  async (
    gameDate: getAllOfficialsCalendarEventsRequestData,
    { rejectWithValue },
  ) => {
    try {
      const data = {
        data: gameDate,
      };

      const response = await fetch(`${URL}/getAllOfficialsCalendarEvents`, {
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

export const getOfficialsStats = createAsyncThunk(
  'user/getOfficialsStats',
  async (statsData: StatsRequestData, { rejectWithValue }) => {
    try {
      const data = {
        data: statsData,
      };

      const response = await fetch(`${URL}/getOfficialsStats`, {
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

export const getUserLeagues = createAsyncThunk(
  'user/getUserLeagues',
  async (uid: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/getUserLeagues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            uid: uid,
          },
        }),
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
      }
    }
  },
);

export const updateOfficialRole = createAsyncThunk(
  'user/updateOfficialRole',
  async (updateData: UpdateOfficialRoleRequestData, { rejectWithValue }) => {
    try {
      console.log('Sending data:', JSON.stringify({ data: updateData }));

      const response = await fetch(`${URL}/updateOfficialRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updateData,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('Server Response:', json);
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
      }
    }
  },
);
