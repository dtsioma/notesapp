import React, { useContext } from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { AuthContext } from "../../App";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { SignupButton } from "./SignupButton";

export const AuthButtons: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

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
