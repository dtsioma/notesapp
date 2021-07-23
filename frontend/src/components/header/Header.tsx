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
      <Navbar
        fixed={!loading && !data.isLoggedIn ? "top" : undefined}
        expand="md"
      >
        <Container className="justify-space-between">
          <Navbar.Brand>
            <Link to="/" className={styles.Title}>
              React Notes App
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsiveAuthButtons" />
          <Navbar.Collapse
            id="responsiveAuthButtons"
            className={["justify-content-end", styles.AuthButtonsCollapse].join(
              " "
            )}
          >
            {pathname.includes("/notes/") ? (
              <Link to="/" className={styles.Back}>
                Back to Notes
              </Link>
            ) : null}
            <AuthButtons />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
