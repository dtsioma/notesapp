import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { ButtonWithClassProps } from "../../utils/interfaces";

export const SignupButton: React.FC<ButtonWithClassProps> = ({
  buttonClass,
}) => {
  return (
    <Link to="/signup">
      <Button variant="outline-primary" className={buttonClass}>
        Sign Up
      </Button>
    </Link>
  );
};
