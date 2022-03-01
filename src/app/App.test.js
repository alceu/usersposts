import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'utils/test';
import App from './App';

jest.mock('features/user/Users', () => () => 'MockedUsers');

describe('App base', () => {
  it('renders main title', async () => {
    render(<App />);

    expect(screen.getByRole('heading')).toHaveTextContent('Users posts');
  });
});
