import React from 'react';
import { screen, fireEvent, within, cleanup } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from 'utils/test';
import { apiUrl } from 'app/api';
import Posts, { defaultLimit as defaultLimitParam } from './Posts';

describe('Posts list', () => {
  const mockedJsonResponse = [
    { id: 1, title: 'Post 1 title', body: 'Post 1 body', userId: 1 },
    { id: 2, title: 'Post 2 title', body: 'Post 2 body', userId: 1 },
    { id: 3, title: 'Post 3 title', body: 'Post 3 body', userId: 1 },
    { id: 4, title: 'Post 4 title', body: 'Post 4 body', userId: 1 },
    { id: 5, title: 'Post 5 title', body: 'Post 5 body', userId: 1 },
  ];

  const mockedUser = { id: 1, name: 'Mocked User 1' };

  const requestUrl = `${apiUrl}/posts`;
  const restHandler = (requestHandler) => rest.get(requestUrl, requestHandler);
  const defaultRequestHandler = async (/* request: */ { url: { searchParams } }, response, context) => {
    let requestResult;

    const [userId, index, limit] = [
      parseInt(searchParams.get('userId'), 10),
      parseInt(searchParams.get('_start'), 10),
      parseInt(searchParams.get('_limit'), 10),
    ];
    if (userId !== mockedUser.id) {
      requestResult = response(context.status(400), context.json({ message: 'Invalid userId param error' }));
    } else {
      requestResult = response(
        context.json(mockedJsonResponse.slice(index || 0, limit || mockedJsonResponse.length)),
        context.delay(150),
      );
    }

    return requestResult;
  };
  const failRequestHandler = async (request, response, context) =>
    response(context.status(500), context.json({ message: 'testErrorMessage' }));

  const server = setupServer(restHandler(defaultRequestHandler));
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  cleanup();
  afterAll(() => server.close());

  const preloadedState = {
    entities: { users: { ids: [mockedUser.id], fetchingIds: [], entities: { [mockedUser.id]: mockedUser } } },
  };

  it('fetches and lists posts with default params ordered by title on request success', async () => {
    render(<Posts userId={mockedUser.id} />, { preloadedState, route: `/${mockedUser.id}`, path: `/:userId` });

    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument();

    const [title, subtitle] = await screen.findAllByRole('heading');
    expect(title).toHaveTextContent(mockedUser.name);
    expect(subtitle).toHaveTextContent('Listing posts');

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
    expect(thirdPostListItem).toHaveTextContent(thirdPostJsonResponse.title);
    expect(thirdPostListItem).toHaveTextContent(thirdPostJsonResponse.body);

    expect(screen.queryByText(fourthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fourthPostJsonResponse.body)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.body)).not.toBeInTheDocument();
  });

  it('fetches and lists posts with limit param', async () => {
    const limitParam = 4;
    render(<Posts userId={mockedUser.id} limit={limitParam} />, {
      preloadedState,
      route: `/${mockedUser.id}`,
      path: `/:userId`,
    });

    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument();

    const [title, subtitle] = await screen.findAllByRole('heading');
    expect(title).toHaveTextContent(mockedUser.name);
    expect(subtitle).toHaveTextContent('Listing posts');

    expect(await screen.findByRole('list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();

    const postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(limitParam);

    const [firstPostListItem, secondPostListItem, thirdPostListItem, fourthPostListItem] = postsListItems;
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
    expect(thirdPostListItem).toHaveTextContent(thirdPostJsonResponse.title);
    expect(thirdPostListItem).toHaveTextContent(thirdPostJsonResponse.body);
    expect(fourthPostListItem).toHaveTextContent(fourthPostJsonResponse.title);
    expect(fourthPostListItem).toHaveTextContent(fourthPostJsonResponse.body);

    expect(screen.queryByText(fifthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.body)).not.toBeInTheDocument();
  });

  it('fetches and increases lists posts on limit param change', async () => {
    const limitParam = 3;
    const { rerender } = render(<Posts userId={mockedUser.id} limit={limitParam} />, {
      preloadedState,
      route: `/${mockedUser.id}`,
      path: `/:userId`,
    });

    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument();

    const [title, subtitle] = await screen.findAllByRole('heading');
    expect(title).toHaveTextContent(mockedUser.name);
    expect(subtitle).toHaveTextContent('Listing posts');

    expect(await screen.findByRole('list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();

    const postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(limitParam);

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
    expect(thirdPostListItem).toHaveTextContent(thirdPostJsonResponse.title);
    expect(thirdPostListItem).toHaveTextContent(thirdPostJsonResponse.body);

    expect(screen.queryByText(fourthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fourthPostJsonResponse.body)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(fifthPostJsonResponse.body)).not.toBeInTheDocument();

    const newLimitParam = 5;
    rerender(<Posts userId={mockedUser.id} limit={newLimitParam} />);

    expect(screen.getByLabelText('Loading posts')).toBeInTheDocument();

    expect(await screen.findByRole('list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();

    const changedPostsListItems = await screen.findAllByRole('listitem');
    expect(changedPostsListItems).toHaveLength(newLimitParam);

    const [, , , fourthPostListItem, fifthPostListItem] = changedPostsListItems;
    expect(fourthPostListItem).toHaveTextContent(fourthPostJsonResponse.title);
    expect(fourthPostListItem).toHaveTextContent(fourthPostJsonResponse.body);
    expect(fifthPostListItem).toHaveTextContent(fifthPostJsonResponse.title);
    expect(fifthPostListItem).toHaveTextContent(fifthPostJsonResponse.body);
  });

  it('fetches and shows error message on request failure', async () => {
    server.use(restHandler(failRequestHandler));

    render(<Posts userId={mockedUser.id} />, { preloadedState, route: `/${mockedUser.id}`, path: `/:userId` });

    expect(await screen.findByRole('alert')).toHaveTextContent('Error fetching posts');

    expect(screen.queryByLabelText('Loading posts')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('hides second post from the list', async () => {
    const limitParam = 3;
    render(<Posts userId={mockedUser.id} limit={limitParam} />, {
      preloadedState,
      route: `/${mockedUser.id}`,
      path: `/:userId`,
    });

    const [, secondPostJsonResponse] = mockedJsonResponse;
    const [, secondPostListItem] = await screen.findAllByRole('listitem');

    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.title);
    expect(secondPostListItem).toHaveTextContent(secondPostJsonResponse.body);

    const hideButton = within(secondPostListItem).getByRole('button', { name: 'Hide' });
    fireEvent.click(hideButton);

    const postsListItems = await screen.findAllByRole('listitem');
    expect(postsListItems).toHaveLength(limitParam - 1);

    expect(screen.queryByText(secondPostJsonResponse.title)).not.toBeInTheDocument();
    expect(screen.queryByText(secondPostJsonResponse.body)).not.toBeInTheDocument();
  });

  it('calls show more function with new posts list limit after clicking on show more button', async () => {
    const onShowMoreMock = jest.fn();
    const limitParam = 3;
    render(<Posts userId={mockedUser.id} limit={limitParam} onShowMore={onShowMoreMock} />, {
      preloadedState,
      route: `/${mockedUser.id}`,
      path: `/:userId`,
    });

    expect(await screen.findAllByRole('listitem')).toHaveLength(limitParam);

    const showMoreButton = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(showMoreButton);

    expect(onShowMoreMock).toHaveBeenCalledWith(limitParam + defaultLimitParam);
  });
});
