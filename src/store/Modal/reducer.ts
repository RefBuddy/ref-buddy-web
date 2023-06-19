import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalOpen: false,
  modalType: '', // display different modals.
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalState: (state, { payload }) => {
      state.modalOpen = payload.modalOpen;
      state.modalType = payload.modalType;
    }
  },
});

export const {
  setModalState
} = modalSlice.actions;

export default modalSlice.reducer;