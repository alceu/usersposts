import { configureStore, combineReducers } from '@reduxjs/toolkit';
import entities from './entities';
import features from './features';

export const appReducer = {
  entities: combineReducers(entities),
  features: combineReducers(features),
};

export default configureStore({
  reducer: appReducer,
});
