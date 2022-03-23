import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'utils/test';
import Index from '.';

const renderUsersMockResult = 'MockedUsers';
jest.mock('features/user/Users', () => () => renderUsersMockResult);

describe('Pages index', () => {
  it('renders title and users list feature', async () => {
    render(<Index />);

    expect(screen.getByRole('heading')).toHaveTextContent('Users posts');
    expect(screen.getByText(renderUsersMockResult)).toBeInTheDocument();
  });
});
