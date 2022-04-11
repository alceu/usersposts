import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LoadingSpinner from 'components/LoadingSpinner';

import { fetchData as fetchPostsData } from '.';

import styles from './Posts.module.scss';

export const defaultLimit = 3;

export default function Posts({ userId, limit: listingLimit = defaultLimit, onClose, onShowMore }) {
  const { posts, users } = useSelector(({ entities }) => ({
    posts: entities.posts,
    users: entities.users,
  }));

  const [INITIAL, READY, MORE] = [0, 1, 2];
  const [loadingStep, setLoadingStep] = useState(INITIAL);
  const [fetchingError, setFechingError] = useState(false);
  const [fetchedPosts, setFechedPosts] = useState(null);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);

  const userIdPrevRef = useRef(userId);

  const maxFetched = useRef(0);

  const listingLimitPrevRef = useRef(listingLimit);
  const [fetchIndex, fetchLimit] =
    listingLimit === listingLimitPrevRef.current || userId !== userIdPrevRef.current
      ? [0, listingLimit]
      : [listingLimitPrevRef.current, listingLimit - listingLimitPrevRef.current];

  const dispatch = useDispatch();
  useEffect(() => {
    const isOtherUser = userId !== userIdPrevRef.current;
    const willFetch = isOtherUser || fetchIndex + fetchLimit > maxFetched.current;

    if (isOtherUser) {
      userIdPrevRef.current = userId;
    }
    if (willFetch) {
      setLoadingStep((currentStep) => {
        let nextStep = currentStep;
        if (currentStep === READY) {
          nextStep = isOtherUser ? INITIAL : MORE;
        }
        return nextStep;
      });
      dispatch(fetchPostsData(userId, fetchIndex, fetchLimit))
        .then(([, postsIds]) => {
          if (isOtherUser) {
            maxFetched.current = postsIds.length;
            setFechedPosts(postsIds);
          } else {
            maxFetched.current += postsIds.length;
            setFechedPosts((current) => (!current ? postsIds : [...current, ...postsIds]));
          }
          if (postsIds.length < fetchLimit) {
            setHasMoreToFetch(false);
          }
          setLoadingStep(READY);
        })
        .catch(() => setFechingError(true));
    }
  }, [dispatch, INITIAL, READY, MORE, userId, fetchIndex, fetchLimit]);

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
        const post1 = posts.entities[postId1];
        const post2 = posts.entities[postId2];

        return post1.title.localeCompare(post2.title);
      };
      const hiddenPostsFilter = (postId) => !hiddenPosts.includes(postId);

      const listingPosts = [...fetchedPosts].sort(postsSort).filter(hiddenPostsFilter).slice(0, listingLimit);

      const user = users.entities[userId];

      const handleShowMoreClick = () => {
        listingLimitPrevRef.current = listingLimit;
        onShowMore(listingLimit + defaultLimit);
      };

      const handleHidePostClick = (postId) => setHiddenPosts((current) => [...current, postId]);

      const handleCloseClick = () => setShowModal(false);

      const handleExitedModalTransition = () => onClose && onClose();

      const hasDisabledShowButton = loadingStep === MORE || (listingLimit >= maxFetched.current && !hasMoreToFetch);

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
            <h4>Listing posts</h4>
            {!listingPosts.length > 0 ? (
              <Alert variant="info">All fetched posts have been hidden</Alert>
            ) : (
              listingPosts.map((postId) => {
                const post = posts.entities[postId];

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
            <Button variant="primary" size="lg" onClick={handleShowMoreClick} disabled={hasDisabledShowButton}>
              Show more
              {loadingStep === MORE && <LoadingSpinner ariaLabel="Loading posts" />}
            </Button>
          </Modal.Body>
        </Modal>
      );
    }

    return renderBodyResult;
  };

  return renderBody();
}
