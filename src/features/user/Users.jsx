import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LoadingSpinner from 'components/LoadingSpinner';

import { fetchList as fetchUsers } from '.';

import styles from './Users.module.scss';

export default function Users({ selectedUserId = null, onUserSelect }) {
  const { users } = useSelector(({ entities }) => ({
    users: entities.users,
  }));

  const [INITIAL, READY] = [0, 1];
  const [loadingStep, setLoadingStep] = useState(INITIAL);
  const [fetchingError, setFechingError] = useState(false);
  const [fetchedUsers, setFechedUsers] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers())
      .then((usersIds) => {
        setFechedUsers(usersIds);
        setLoadingStep((current) => current + 1);
      })
      .catch(() => setFechingError(true));
  }, [dispatch]);

  const listingLimit = 3;
  const [listingIndex, setListingIndex] = useState(listingLimit);

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
      const listingUsers = [...fetchedUsers].sort(usersSort).slice(0, listingIndex);

      const handleShowMoreClick = () => setListingIndex((current) => current + listingLimit);

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
            className={styles['show-more']}
            onClick={handleShowMoreClick}
            disabled={listingIndex >= fetchedUsers.length}>
            Show more
          </Button>
        </>
      );
    }

    return renderBodyResult;
  };

  return renderBody();
}
