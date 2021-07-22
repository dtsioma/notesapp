import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export const Home: React.FC = () => {
  return (
    <main className={styles.Home}>
      <Container>
        <Row className="justify-content-center">
          <h1 className={styles.Heading}>Let's make some notes.</h1>
        </Row>
        <Row className="justify-content-center">
          <Link
            to="/login"
            style={{
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="primary" size="lg" className="w-auto mt-4">
              Start Now
            </Button>
          </Link>
        </Row>
      </Container>
    </main>
  );
};
