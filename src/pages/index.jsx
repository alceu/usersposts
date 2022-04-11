import React from 'react';
import { Route, Routes, Outlet, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Users from 'features/user/Users';
import Posts from 'features/post/Posts';

function UsersPage() {
  const navigate = useNavigate();

  const { userId: userIdPathParam } = useParams();
  const selectedUserId = parseInt(userIdPathParam, 10);

  const handleSelectUser = (userId) => navigate(`${userId}`);

  return (
    <>
      <Users selectedUserId={selectedUserId} onUserSelect={handleSelectUser} />
      <Outlet />
    </>
  );
}

function PostsPage() {
  const { userId: userIdPathParam } = useParams();
  const selectedUserId = parseInt(userIdPathParam, 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = (searchParams.get('postsLimit') && parseInt(searchParams.get('postsLimit'), 10)) || undefined;

  const navigate = useNavigate();

  const handleClose = () => navigate('../');

  const handleShowMore = (newLimit) => setSearchParams({ postsLimit: newLimit });

  return <Posts userId={selectedUserId} limit={limit} onShowMore={handleShowMore} onClose={handleClose} />;
}

function UsersRoutes() {
  return (
    <Routes>
      <Route path="*" element={<UsersPage />}>
        <Route path=":userId" element={<PostsPage />} />
      </Route>
    </Routes>
  );
}

function Page() {
  return (
    <Container>
      <Row fluid="sm">
        <Col>
          <h1>Users posts</h1>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default function Index() {
  return (
    <Routes>
      <Route element={<Page />}>
        <Route path="/*" element={<UsersRoutes />} />
      </Route>
    </Routes>
  );
}
