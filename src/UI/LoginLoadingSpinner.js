import React from "react";
import { Spinner } from "react-bootstrap";

function LoginLoadingSpinner() {
  return (
    <>
      <Spinner animation="border" role="status" variant="light" size="sm"></Spinner>
    </>
  );
}

export default LoginLoadingSpinner;
