import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner({ ariaLabel = 'Loading' }) {
  return <Spinner animation="grow" aria-label={ariaLabel} />;
}
