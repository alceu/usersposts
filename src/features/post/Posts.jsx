import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LoadingSpinner from 'components/LoadingSpinner';

import { setSelected as setSelectedUser } from 'features/user';
import { fetchList as fetchPosts } from '.';

import styles from './Posts.module.scss';

export default function Posts({ userId: userIdParam = null }) {
  const { posts, users, selectedUserId } = useSelector(
    ({
      entities,
      features: {
        user: { selected },
      },
    }) => ({
      posts: entities.posts,
      users: entities.users,
      selectedUserId: selected,
    }),
  );
  const userId = userIdParam || selectedUserId;

  const [INITIAL, READY] = [0, 1];
  const [loadingStep, setLoadingStep] = useState(INITIAL);
  const [fetchingError, setFechingError] = useState(false);
  const [fetchedPosts, setFechedPosts] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts(userId))
      .then((postsIds) => {
        setFechedPosts(postsIds);
        setLoadingStep((current) => current + 1);
      })
      .catch(() => setFechingError(true));
  }, [dispatch, userId]);

  const listingLimit = 3;
  const [listingIndex, setListingIndex] = useState(listingLimit);

  const [showModal, setShowModal] = useState(true);

  const [hiddenPosts, setHiddenPosts] = useState([]);

  const renderBody = () => {
    let renderBodyResult;

    if (fetchingError) {
      renderBodyResult = <Alert variant="danger">Error fetching posts</Alert>;
    } else if (loadingStep < READY) {
      renderBodyResult = <LoadingSpinner ariaLabel="Loading posts" />;
    } else if (!fetchedPosts.length > 0) {
      renderBodyResult = <Alert variant="info">User with no posts to show</Alert>;
    } else {
      const postsSort = (postId1, postId2) => {
        const post1 = posts.byId[postId1];
        const post2 = posts.byId[postId2];

        return post1.title.localeCompare(post2.title);
      };
      const postsFilter = (postId) => {
        const post = posts.byId[postId];

        return post.userId === userId;
      };
      const hiddenPostsFilter = (postId) => !hiddenPosts.includes(postId);

      const listingPosts = [...fetchedPosts]
        .filter(postsFilter)
        .sort(postsSort)
        .slice(0, listingIndex)
        .filter(hiddenPostsFilter);

      const user = users.byId[userId];

      const handleShowMoreClick = () => setListingIndex((current) => current + listingLimit);

      const handleHidePostClick = (postId) => setHiddenPosts((current) => [...current, postId]);

      const handleCloseClick = () => setShowModal(false);

      const handleExitedModalTransition = () => dispatch(setSelectedUser(null));

      renderBodyResult = (
        <Modal
          animation
          autoFocus
          centered
          scrollable
          show={showModal}
          onHide={handleCloseClick}
          onExited={handleExitedModalTransition}>
          <Modal.Header closeButton>
            <Modal.Title role="heading">{user.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body role="list">
            {!listingPosts.length > 0 ? (
              <Alert variant="info">All fetched posts have been hidden</Alert>
            ) : (
              listingPosts.map((postId) => {
                const post = posts.byId[postId];

                return (
                  <Card key={postId} role="listitem" className={styles.post}>
                    <Card.Header>
                      <Card.Title>{post.title}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>{post.body}</Card.Text>
                      <Button variant="primary" onClick={() => handleHidePostClick(postId)}>
                        Hide
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })
            )}
            <Button variant="primary" onClick={handleShowMoreClick} disabled={listingIndex >= fetchedPosts.length}>
              Show more
            </Button>
          </Modal.Body>
        </Modal>
      );
    }

    return renderBodyResult;
  };

  return renderBody();
}
