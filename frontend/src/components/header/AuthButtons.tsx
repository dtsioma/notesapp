import React from "react";
import Nav from "react-bootstrap/Nav";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { SignupButton } from "./SignupButton";

export const AuthButtons: React.FC = () => {
  const isAuthenticated = false;

  let buttons = (
    <React.Fragment>
      <SignupButton buttonClass="me-2" />
      <LoginButton />
    </React.Fragment>
  );

  if (isAuthenticated) {
    buttons = <LogoutButton />;
  }

  return <ButtonToolbar>{buttons}</ButtonToolbar>;
};
