import React from "react";
import Button from "react-bootstrap/Button";
import { ButtonWithClassProps } from "../../utils/interfaces";

export const SignupButton: React.FC<ButtonWithClassProps> = ({
  buttonClass,
}) => {
  return (
    <Button variant="outline-primary" className={buttonClass}>
      Sign Up
    </Button>
  );
};
