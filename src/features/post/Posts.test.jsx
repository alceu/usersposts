import React from 'react';
import { screen, fireEvent, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from 'utils/test';
import { apiUrl } from 'app/api';
import Posts from './Posts';

describe('Posts list', () => {
  const mockedJsonResponse = [
    { id: 1, title: 'Post 1 title', body: 'Post 1 body', userId: 1 },
    { id: 2, title: 'Post 2 title', body: 'Post 2 body', userId: 1 },
    { id: 3, title: 'Post 3 title', body: 'Post 3 body', userId: 2 },
    { id: 4, title: 'Post 4 title', body: 'Post 4 body', userId: 1 },
    { id: 5, title: 'Post 5 title', body: 'Post 5 body', userId: 1 },
  ];

  const mockedUser = { id: 1, name: 'Mocked User 1' };

  const requestUrl = `${apiUrl}/posts`;
  const restHandler = (requestHandler) => rest.get(requestUrl, requestHandler);
  const defaultRequestHandler = async (/* request: */ { url: { searchParams } }, response, context) =>
    parseInt(searchParams.get('userId'), 10) !== mockedUser.id
      ? response(context.status(400), context.json({ message: 'Unknown userId' }))
      : response(context.json(mockedJsonResponse), context.delay(150));
  const failRequestHandler = async (request, response, context) =>
    response(context.status(500), context.json({ message: 'testErrorMessage' }));

  const server = setupServer(restHandler(defaultRequestHandler));
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const preloadedState = {
    entities: { users: { allIds: [mockedUser.id], byId: { [mockedUser.id]: mockedUser } } },
  };

  it('fetches and lists posts by userId param ordered by title on request success', async () => {
    render(<Posts userId={mockedUser.id} />, { preloadedState });

    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument();

    expect(await screen.findByRole('heading')).toHaveTextContent(mockedUser.name);

    expect(await screen.findByRole('list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();

    const postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(3);

    const [firstPostListItem, secondPostListItem, thirdPostListItem] = postsListItems;
    const [
      firstPostJsonResponse,
      secondPostJsonResponse,
      thirdPostJsonResponse,
      fourthPostJsonResponse,
      fifthPostJsonResponse,
    ] = mockedJsonResponse;

    expect(firstPostListItem).toHaveTextContent(firstPostJsonResponse.title);
    expect(firstPostListItem).toHaveTextContent(firstPostJsonResponse.body);
    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.title);
    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.body);
    expect(thirdPostListItem).toHaveTextContent(fourthPostJsonResponse.title);
    expect(thirdPostListItem).toHaveTextContent(fourthPostJsonResponse.body);

    expect(screen.queryByText(thirdPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(thirdPostJsonResponse.body)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.body)).not.toBeInTheDocument();
  });

  it('fetches and lists posts by selected user feature ordered by title on request success', async () => {
    render(<Posts />, { preloadedState: { ...preloadedState, features: { user: { selected: mockedUser.id } } } });

    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument();

    expect(await screen.findByRole('heading')).toHaveTextContent(mockedUser.name);

    expect(await screen.findByRole('list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();

    const postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(3);

    const [firstPostListItem, secondPostListItem, thirdPostListItem] = postsListItems;
    const [
      firstPostJsonResponse,
      secondPostJsonResponse,
      thirdPostJsonResponse,
      fourthPostJsonResponse,
      fifthPostJsonResponse,
    ] = mockedJsonResponse;

    expect(firstPostListItem).toHaveTextContent(firstPostJsonResponse.title);
    expect(firstPostListItem).toHaveTextContent(firstPostJsonResponse.body);
    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.title);
    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.body);
    expect(thirdPostListItem).toHaveTextContent(fourthPostJsonResponse.title);
    expect(thirdPostListItem).toHaveTextContent(fourthPostJsonResponse.body);

    expect(screen.queryByText(thirdPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(thirdPostJsonResponse.body)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.body)).not.toBeInTheDocument();
  });

  it('fetches and shows error message on request failure', async () => {
    server.use(restHandler(failRequestHandler));

    render(<Posts userId={mockedUser.id} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error fetching posts');

    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('hides second post from the list', async () => {
    render(<Posts userId={mockedUser.id} />, { preloadedState });

    const [, secondPostJsonResponse] = mockedJsonResponse;
    const [, secondPostListItem] = await screen.findAllByRole('listitem');

    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.title);
    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.body);

    const hideButton = within(secondPostListItem).getByRole('button', { name: 'Hide' });
    fireEvent.click(hideButton);

    const postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(2);

    expect(screen.queryByText(secondPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(secondPostJsonResponse.body)).not.toBeInTheDocument();
  });

  it('shows the fourth post after clicking show more button', async () => {
    render(<Posts userId={mockedUser.id} />, { preloadedState });

    let postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(3);

    const [, , , , fifthPostJsonResponse] = mockedJsonResponse;
    expect(screen.queryByText(fifthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.body)).not.toBeInTheDocument();

    const showMoreButton = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(showMoreButton);

    postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(4);

    const [, , , fourthPostListItem] = postsListItems;
    expect(fourthPostListItem).toHaveTextContent(fifthPostJsonResponse.title);
    expect(fourthPostListItem).toHaveTextContent(fifthPostJsonResponse.body);
  });
});
