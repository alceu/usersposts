import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import LoadingSpinner from 'components/LoadingSpinner';
import { Posts } from 'features/post/Posts';

import { setSelected as setSelectedUser, fetchList as fetchUsers } from '.';

export default function Users() {
  const { users, selectedUserId } = useSelector(
    ({
      entities,
      features: {
        user: { selected },
      },
    }) => ({
      users: entities.users,
      selectedUserId: selected,
    }),
  );

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
      renderBodyResult = <Alert variant="danger">Fetching users error</Alert>;
    } else if (loadingStep < READY) {
      renderBodyResult = <LoadingSpinner ariaLabel="Loading users" />;
    } else {
      const usersSort = (userId1, userId2) => {
        const user1 = users.byId[userId1];
        const user2 = users.byId[userId2];

        return user1.name.localeCompare(user2.name);
      };
      const listingUsers = [...fetchedUsers].sort(usersSort).slice(0, listingIndex);

      const handleSelectUserClick = (userId) => dispatch(setSelectedUser(userId));
      const handleShowMoreClick = () => setListingIndex((current) => current + listingLimit);

      renderBodyResult = (
        <Row>
          <Col>
            <ListGroup role="listbox" aria-multiselectable={false}>
              <header>
                <h2>Listing users</h2>
                <p>Select one:</p>
              </header>
              {listingUsers.map((userId) => {
                const user = users.byId[userId];

                return (
                  <ListGroup.Item
                    key={userId}
                    role="option"
                    aria-selected={userId === selectedUserId}
                    active={userId === selectedUserId}
                    action
                    onClick={() => handleSelectUserClick(userId)}>
                    {user.name}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            <Button variant="primary" onClick={handleShowMoreClick} disabled={listingIndex >= fetchedUsers.length}>
              Show more
            </Button>
            {selectedUserId && <Posts userId={selectedUserId} />}
          </Col>
        </Row>
      );
    }

    return renderBodyResult;
  };

  return renderBody();
}
