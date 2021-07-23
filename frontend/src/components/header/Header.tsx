import { QueryResult } from "@apollo/client";
import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useIsLoggedInQuery } from "../../generated/graphql";
import { AuthButtons } from "./AuthButtons";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const { data, loading }: QueryResult = useIsLoggedInQuery();
  const { pathname } = useLocation();

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
            {pathname.includes("/notes/") ? (
              <Link to="/" className="ms-5">
                <small>Back to Notes</small>
              </Link>
            ) : null}
          </Navbar.Brand>
          <AuthButtons />
        </Container>
      </Navbar>
    </header>
  );
};
