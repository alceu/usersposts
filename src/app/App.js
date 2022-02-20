import React from 'react';

// import { Users } from 'features/user/Users';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.scss';

export default function App() {
  return (
    <Container>
      <Row fluid="md">
        <Col>Users</Col>
      </Row>
    </Container>
  );
}
