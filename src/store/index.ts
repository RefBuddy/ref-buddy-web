import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import userReducer from './User/reducer';
import gamesReducer from './Games/reducer';
import modalReducer from './Modal/reducer';
import officialsReducer from './OfficialsList/reducer';
import assigningReducer from './Assigning/reducer';
import statsReducer from './Stats/reducer';

export const rootReducer = combineReducers({
  user: userReducer,
  games: gamesReducer,
  modal: modalReducer,
  officials: officialsReducer,
  assigning: assigningReducer,
  stats: statsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

export default store;
