import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Users from 'features/user/Users';
import Posts from 'features/post/Posts';

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

function UsersPage() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <>
            <Users />
            <Outlet />
          </>
        }>
        <Route path=":userId" element={<Posts />} />
      </Route>
    </Routes>
  );
}

export default function Index() {
  return (
    <Routes>
      <Route element={<Page />}>
        <Route path="/*" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}
