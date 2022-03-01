import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from 'utils/test';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Users from './Users';

const baseURL = process.env.REACT_APP_API_URL || '';

const jsonResponse = [
  { id: 1, name: 'Abraham Smith' },
  { id: 2, name: 'Johana Misty' },
];

const handlers = [
  rest.get(`${baseURL}/users`, (request, response, context) =>
    response(context.json(jsonResponse), context.delay(150)),
  ),
];

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Users list', () => {
  it('fetches and lists users ordered by name on request success', async () => {
    render(<Users />);

    expect(screen.getByLabelText('Loading users')).toBeInTheDocument();

    expect(await screen.findByRole('heading')).toHaveTextContent('Listing users');
    expect(await screen.findByText('Select one:')).toBeInTheDocument();

    expect(await screen.findByRole('listbox')).toBeInTheDocument();

    const usersListItems = await screen.findAllByRole('option');
    expect(usersListItems).toHaveLength(jsonResponse.length);
    expect(usersListItems[0]).toHaveTextContent(jsonResponse[0].name);
    expect(usersListItems[1]).toHaveTextContent(jsonResponse[1].name);

    expect(screen.queryByLabelText('Loading users')).not.toBeInTheDocument();
  });

  it('fetches and shows error message on request failure', async () => {
    server.use(
      rest.get(`${baseURL}/users`, async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'testErrorMessage' }));
      }),
    );

    render(<Users />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Fetching users error');

    expect(screen.queryByLabelText('Loading users')).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects second user from the list', async () => {
    render(<Users />);

    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();

    const [, secondUserOption] = await screen.findAllByRole('option');
    fireEvent.click(secondUserOption);
    expect(secondUserOption).toHaveAttribute('aria-selected', 'true');
  });
});
