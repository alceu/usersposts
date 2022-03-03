import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from 'utils/test';
import { apiUrl } from 'app/api';
import Users from './Users';

const mockedPostsTextResult = 'MockedPosts';
jest.mock('features/post/Posts', () => () => mockedPostsTextResult);

describe('Users list', () => {
  const mockedJsonResponse = [
    { id: 1, name: 'Abraham Smith' },
    { id: 2, name: 'Johana Misty' },
  ];

  const requestUrl = `${apiUrl}/users`;
  const restHandler = (requestHandler) => rest.get(requestUrl, requestHandler);
  const defaultRequestHandler = async (request, response, context) =>
    response(context.json(mockedJsonResponse), context.delay(150));
  const failRequestHandler = async (request, response, context) =>
    response(context.status(500), context.json({ message: 'testErrorMessage' }));

  const server = setupServer(restHandler(defaultRequestHandler));
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches and lists users ordered by name on request success', async () => {
    render(<Users />);

    expect(screen.getByLabelText('Loading users')).toBeInTheDocument();

    expect(await screen.findByRole('heading')).toHaveTextContent('Listing users');
    expect(await screen.findByText('Select one:')).toBeInTheDocument();

    expect(await screen.findByRole('listbox')).toBeInTheDocument();

    const usersListItems = await screen.findAllByRole('option');
    expect(usersListItems).toHaveLength(mockedJsonResponse.length);
    expect(usersListItems[0]).toHaveTextContent(mockedJsonResponse[0].name);
    expect(usersListItems[1]).toHaveTextContent(mockedJsonResponse[1].name);

    expect(screen.queryByLabelText('Loading users')).not.toBeInTheDocument();
  });

  it('fetches and shows error message on request failure', async () => {
    server.use(restHandler(failRequestHandler));

    render(<Users />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Fetching users error');

    expect(screen.queryByLabelText('Loading users')).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects second user from the list and renders posts list feature', async () => {
    render(<Users />);

    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
    expect(screen.queryByText(mockedPostsTextResult)).not.toBeInTheDocument();

    const [, secondUserOption] = await screen.findAllByRole('option');
    fireEvent.click(secondUserOption);
    expect(secondUserOption).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByText('Loading users')).not.toBeInTheDocument();
    expect(screen.getByText(mockedPostsTextResult)).toBeInTheDocument();
  });
});
