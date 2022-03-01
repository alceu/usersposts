import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { appReducer } from 'app/store';
import { configure } from '@testing-library/dom';

configure({ computedStyleSupportsPseudoElements: true });

// https://redux.js.org/usage/writing-tests#connected-components
export const render = (
  ui,
  { preloadedState, store = configureStore({ reducer: appReducer, preloadedState }), ...renderOptions } = {},
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
