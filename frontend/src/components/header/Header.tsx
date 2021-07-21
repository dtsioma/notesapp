import { QueryResult } from "@apollo/client";
import React, { useContext } from "react";
import { Navbar, Container } from "react-bootstrap";
import { useIsLoggedInQuery } from "../../generated/graphql";
import { AuthButtons } from "./AuthButtons";

export const Header: React.FC = () => {
  const { data, loading }: QueryResult = useIsLoggedInQuery();

  if (loading) {
    return <div></div>;
  }

  return (
    <header>
      <Navbar fixed={!loading && !data.isLoggedIn ? "top" : undefined}>
        <Container>
          <Navbar.Brand>React Notes App</Navbar.Brand>
          <AuthButtons />
        </Container>
      </Navbar>
    </header>
  );
};
