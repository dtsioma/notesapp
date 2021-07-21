import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export const Home: React.FC = () => {
  return (
    <main className={styles.Home}>
      <Container>
        <Row className="justify-content-center">
          <h1 className={styles.Heading}>Notes App</h1>
        </Row>
        <Row className="justify-content-center">
          <Button variant="primary" size="lg" className="w-auto mt-4">
            <Link
              to="/login"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Start Now
            </Link>
          </Button>
        </Row>
      </Container>
    </main>
  );
};
