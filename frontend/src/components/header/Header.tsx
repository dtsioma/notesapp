import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { AuthButtons } from "./AuthButtons";

export const Header: React.FC = () => {
  return (
    <header>
      <Navbar fixed="top">
        <Container>
          <Navbar.Brand>React Notes App</Navbar.Brand>
          <AuthButtons />
        </Container>
      </Navbar>
    </header>
  );
};
