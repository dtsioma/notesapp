import React, { useContext } from "react";
import { Navbar, Container } from "react-bootstrap";
import { AuthContext } from "../../App";
import { AuthButtons } from "./AuthButtons";

export const Header: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <header>
      <Navbar fixed={!isAuthenticated ? "top" : undefined}>
        <Container>
          <Navbar.Brand>React Notes App</Navbar.Brand>
          <AuthButtons />
        </Container>
      </Navbar>
    </header>
  );
};
