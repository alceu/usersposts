import { configureStore, combineReducers } from '@reduxjs/toolkit';
import entities from './entities';
import features from './features';

export default configureStore({
  reducer: {
    entities: combineReducers(entities),
    features: combineReducers(features),
  },
});
