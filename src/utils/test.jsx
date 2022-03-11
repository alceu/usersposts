import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { appReducer } from 'app/store';

// https://redux.js.org/usage/writing-tests#connected-components
// eslint-disable-next-line import/prefer-default-export
export function render(
  ui,
  { preloadedState, store = configureStore({ reducer: appReducer, preloadedState }), ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
