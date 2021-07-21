import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export const LoginButton: React.FC = () => {
  return (
    <Link to="/login">
      <Button variant="primary">Log In</Button>
    </Link>
  );
};
