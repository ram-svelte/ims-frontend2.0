import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingSpinner() {
  return (
    <>
      <Spinner animation="border" role="status"></Spinner>
    </>
  );
}

export default LoadingSpinner;
