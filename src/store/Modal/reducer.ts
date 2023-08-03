import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedGames: {
    open: false,
  }, 
  assignGame: {
    open: false,
  },
  officialsList: {
    open: false,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalState: (state, action) => {
      console.log('setModalState', action.payload);
      state[action.payload.key] = action.payload.value;
}
  },
});

export const {
  setModalState
} = modalSlice.actions;

export default modalSlice.reducer;