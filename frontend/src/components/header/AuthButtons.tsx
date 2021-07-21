import { QueryResult } from "@apollo/client";
import React, { useContext } from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { useIsLoggedInQuery } from "../../generated/graphql";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { SignupButton } from "./SignupButton";

export const AuthButtons: React.FC = () => {
  const {
    data: { isLoggedIn },
    loading,
  }: QueryResult = useIsLoggedInQuery();

  let buttons = (
    <React.Fragment>
      <SignupButton buttonClass="me-2" />
      <LoginButton />
    </React.Fragment>
  );

  if (loading) {
    return <div></div>;
  }

  if (!loading && isLoggedIn) {
    buttons = <LogoutButton />;
  }

  return <ButtonToolbar>{buttons}</ButtonToolbar>;
};
