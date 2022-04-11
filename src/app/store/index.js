import { configureStore as baseConfigureStore, combineReducers } from '@reduxjs/toolkit';
import api from 'app/api';
import entities from './entities';

const appReducer = {
  entities: combineReducers(entities),
};

export const configureStore = ({ reducer = appReducer, preloadedState }) =>
  baseConfigureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }),
  });

const store = configureStore({
  appReducer,
});

export default store;
