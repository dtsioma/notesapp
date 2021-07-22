import { QueryResult } from "@apollo/client";
import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useIsLoggedInQuery } from "../../generated/graphql";
import { AuthButtons } from "./AuthButtons";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const { data, loading }: QueryResult = useIsLoggedInQuery();

  if (loading) {
    return <div></div>;
  }

  return (
    <header>
      <Navbar fixed={!loading && !data.isLoggedIn ? "top" : undefined}>
        <Container>
          <Navbar.Brand>
            <Link to="/" className={styles.Title}>
              React Notes App
            </Link>
          </Navbar.Brand>
          <AuthButtons />
        </Container>
      </Navbar>
    </header>
  );
};
