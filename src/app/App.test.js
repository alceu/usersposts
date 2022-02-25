import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

describe('App base', () => {
  it('renders main title', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText('Users posts')).toBeInTheDocument();
  });
});
