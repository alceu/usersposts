import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'utils/test';
import App from './App';

const renderUsersMockResult = 'MockedUsers';
jest.mock('features/user/Users', () => () => renderUsersMockResult);

describe('App base', () => {
  it('renders title and users list feature', async () => {
    render(<App />);

    expect(screen.getByRole('heading')).toHaveTextContent('Users posts');
    expect(screen.getByText(renderUsersMockResult)).toBeInTheDocument();
  });
});
