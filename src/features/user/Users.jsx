import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LoadingSpinner from 'components/LoadingSpinner';

import { fetchData as fetchUsers } from '.';

import styles from './Users.module.scss';

export const defaultLimit = 3;

export default function Users({ selectedUserId = null, onUserSelect, limit: listingLimit = defaultLimit, onShowMore }) {
  const { users } = useSelector(({ entities }) => ({
    users: entities.users,
  }));

  const [INITIAL, READY, MORE] = [0, 1, 2];
  const [loadingStep, setLoadingStep] = useState(INITIAL);
  const [fetchingError, setFechingError] = useState(false);
  const [fetchedUsers, setFechedUsers] = useState(null);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);

  const maxFetched = useRef(0);

  const listingLimitPrevRef = useRef(listingLimit);
  const [fetchIndex, fetchLimit] =
    listingLimit === listingLimitPrevRef.current
      ? [0, listingLimit]
      : [listingLimitPrevRef.current, listingLimit - listingLimitPrevRef.current];

  const dispatch = useDispatch();

  useEffect(() => {
    const willFetch = fetchIndex + fetchLimit > maxFetched.current;
    if (willFetch) {
      setLoadingStep((currentStep) => (currentStep === READY ? MORE : currentStep));
      dispatch(fetchUsers(fetchIndex, fetchLimit))
        .then((usersIds) => {
          maxFetched.current += usersIds.length;
          setFechedUsers((current) => (!current ? usersIds : [...current, ...usersIds]));
          setLoadingStep(READY);
          if (usersIds.length < fetchLimit) {
            setHasMoreToFetch(false);
          }
        })
        .catch(() => setFechingError(true));
    }
  }, [dispatch, MORE, READY, fetchIndex, fetchLimit]);

  const renderBody = () => {
    let renderBodyResult;

    if (fetchingError) {
      renderBodyResult = <Alert variant="danger">Error fetching users</Alert>;
    } else if (loadingStep < READY) {
      renderBodyResult = <LoadingSpinner ariaLabel="Loading users" />;
    } else if (!fetchedUsers.length > 0) {
      renderBodyResult = <Alert variant="info">No users to show</Alert>;
    } else {
      const usersSort = (userId1, userId2) => {
        const user1 = users.entities[userId1];
        const user2 = users.entities[userId2];

        return user1.name.localeCompare(user2.name);
      };
      const listingUsers = [...fetchedUsers].sort(usersSort).slice(0, listingLimit);

      const handleShowMoreClick = () => {
        listingLimitPrevRef.current = listingLimit;
        onShowMore(listingLimit + defaultLimit);
      };

      const handleSelecUserClick = (userId) => onUserSelect(userId);

      renderBodyResult = (
        <>
          <h2>Listing users</h2>
          <p>Select one:</p>
          <ListGroup role="listbox" aria-multiselectable={false}>
            {listingUsers.map((userId) => {
              const user = users.entities[userId];

              return (
                <ListGroup.Item
                  key={userId}
                  role="option"
                  action
                  onClick={() => handleSelecUserClick(userId)}
                  active={userId === selectedUserId}
                  aria-current={userId === selectedUserId}>
                  {user.name}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <Button
            variant="primary"
            size="lg"
            className={styles['show-more']}
            onClick={handleShowMoreClick}
            disabled={loadingStep === MORE || !hasMoreToFetch}>
            Show more
            {loadingStep === MORE && <LoadingSpinner ariaLabel="Loading users" />}
          </Button>
        </>
      );
    }

    return renderBodyResult;
  };

  return renderBody();
}
