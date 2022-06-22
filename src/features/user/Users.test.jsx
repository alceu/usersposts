import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from 'utils/test';
import { apiUrl } from 'app/api';
import Users, { defaultLimit as defaultLimitParam } from './Users';

describe('Users list', () => {
  const mockedJsonResponse = [
    { id: 1, name: 'Abraham Smith' },
    { id: 2, name: 'Johana Misty' },
    { id: 3, name: 'Miro Jones' },
    { id: 4, name: 'Sara Silva' },
  ];

  const requestUrl = `${apiUrl}/users`;
  const restHandler = (requestHandler) => rest.get(requestUrl, requestHandler);

  const defaultRequestHandler = async (/* request: */ { url: { searchParams } }, response, context) => {
    const [index, limit] = [parseInt(searchParams.get('_start'), 10), parseInt(searchParams.get('_limit'), 10)];
    const requestResult = response(
      context.json(mockedJsonResponse.slice(index || 0, limit || mockedJsonResponse.length)),
      context.delay(150),
    );

    return requestResult;
  };

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

    const usersOptions = await screen.findAllByRole('option');
    expect(usersOptions).toHaveLength(3);

    expect(screen.queryByLabelText('Loading users')).not.toBeInTheDocument();

    const [firstUserOption, secondUserOption, thirdUserOption] = usersOptions;
    const [firstUserJsonResponse, secondUserJsonResponse, thirdUserJsonResponse] = mockedJsonResponse;

    expect(firstUserOption).toHaveTextContent(firstUserJsonResponse.name);
    expect(secondUserOption).toHaveTextContent(secondUserJsonResponse.name);
    expect(thirdUserOption).toHaveTextContent(thirdUserJsonResponse.name);
  });

  it('fetches and shows error message on request failure', async () => {
    server.use(restHandler(failRequestHandler));

    render(<Users />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error fetching users');

    expect(screen.queryByLabelText('Loading users')).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects second user from the list', async () => {
    const onUserSelectMock = jest.fn();
    render(<Users onUserSelect={onUserSelectMock} />);

    expect(screen.queryByRole('option', { current: true })).not.toBeInTheDocument();

    const [, secondUserOption] = await screen.findAllByRole('option');
    fireEvent.click(secondUserOption);

    expect(screen.queryByText('Loading users')).not.toBeInTheDocument();

    const [, secondUserJsonResponse] = mockedJsonResponse;
    expect(onUserSelectMock).toHaveBeenCalledWith(secondUserJsonResponse.id);
  });

  it('calls show more function with new users list limit after clicking on show more button', async () => {
    const onShowMoreMock = jest.fn();
    const limitParam = 3;
    render(<Users limit={limitParam} onShowMore={onShowMoreMock} />);

    const usersOptions = await screen.findAllByRole('option');
    expect(usersOptions).toHaveLength(limitParam);

    const [, , , fourthUserJsonResponse] = mockedJsonResponse;
    expect(screen.queryByText(fourthUserJsonResponse.name)).not.toBeInTheDocument();

    const showMoreButton = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(showMoreButton);
    expect(onShowMoreMock).toHaveBeenCalledWith(limitParam + defaultLimitParam);
  });
});
