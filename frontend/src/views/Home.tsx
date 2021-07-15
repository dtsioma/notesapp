import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import styles from "./Home.module.css";

export const Home: React.FC = () => {
  return (
    <main className={styles.Home}>
      <Container>
        <Row className="justify-content-center">
          <h1 className={styles.Heading}>Make a note. Share it.</h1>
        </Row>
        <Row className="justify-content-center">
          <Button variant="primary" size="lg" className="w-auto mt-4">
            Start Now
          </Button>
        </Row>
      </Container>
    </main>
  );
};
