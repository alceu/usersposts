import { configureStore, combineReducers } from '@reduxjs/toolkit';
import entities from './entities';

export const appReducer = {
  entities: combineReducers(entities),
};

export default configureStore({
  reducer: appReducer,
});
