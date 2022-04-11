import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from 'app/store';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export function render(ui, { route = '/', path = '*', preloadedState, ...renderOptions } = {}) {
  const store = configureStore({ preloadedState });
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={children} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  }

  const rendered = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  const rerender = (rerenderUi, rerenderOptions) =>
    render(rerenderUi, { container: rendered.container, route, path, preloadedState, ...rerenderOptions });

  return { ...rendered, rerender };
}
