import React from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ClampLines from "react-clamp-lines";
import TimeAgo from "react-timeago";
import styles from "./Notes.module.css";

interface Note {
  id: number;
  title: string;
  text: string;
  dateCreated: string;
  dateUpdated: string;
}

const myNotes = [
  {
    id: 1,
    title: "First note",
    text: `Hello!
    This is my first note!`,
    dateCreated: "Wed Jul 14 2021 17:31:25 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:31:25 GMT-0700 (PDT)",
  },
  {
    id: 2,
    title: "Another note",
    text: `Ok,
    here we go,
    another note by me`,
    dateCreated: "Wed Jul 14 2021 17:35:23 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:35:23 GMT-0700 (PDT)",
  },
  {
    id: 3,
    title: "This is my first note",
    text: `Hello Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores vero dolorum similique provident ducimus natus, error sunt quae est sit!!
    This is my first note!`,
    dateCreated: "Wed Jul 14 2021 17:35:44 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:35:44 GMT-0700 (PDT)",
  },
];

const sharedNotes = [
  {
    id: 4,
    title: "First note",
    text: `Hello!
    This is my first note!`,
    dateCreated: "Wed Jul 14 2021 17:31:25 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:31:25 GMT-0700 (PDT)",
  },
  {
    id: 5,
    title: "Another note",
    text: `Ok,
    here we go,
    another note by me`,
    dateCreated: "Wed Jul 14 2021 17:35:23 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:35:23 GMT-0700 (PDT)",
  },
  {
    id: 6,
    title: "This is my first note",
    text: `Hello Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores vero dolorum similique provident ducimus natus, error sunt quae est sit!!
    This is my first note!`,
    dateCreated: "Wed Jul 14 2021 17:35:44 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:35:44 GMT-0700 (PDT)",
  },
];

myNotes.sort((a: Note, b: Note) => {
  if (Date.parse(b.dateUpdated) > Date.parse(a.dateUpdated)) return 1;
  else if (Date.parse(a.dateUpdated) > Date.parse(b.dateUpdated)) return -1;
  else return 0;
});

sharedNotes.sort((a: Note, b: Note) => {
  if (Date.parse(b.dateUpdated) > Date.parse(a.dateUpdated)) return 1;
  else if (Date.parse(a.dateUpdated) > Date.parse(b.dateUpdated)) return -1;
  else return 0;
});

export const Notes: React.FC = () => {
  return (
    <main className={styles.Notes}>
      <Container>
        <Row className="mb-4">
          <h1>Your Notes</h1>
        </Row>
        <Row className="mb-5">
          {myNotes.map((note, idx) => (
            <Col key={idx} className="col-3">
              <Card border="primary">
                <Link to={`/notes/${note.id}`} className={styles.CardLink}>
                  <Card.Body>
                    <Card.Title>{note.title}</Card.Title>
                    <Card.Subtitle className="text-muted mb-3">
                      <TimeAgo date={note.dateUpdated} />
                    </Card.Subtitle>
                    <Card.Text>
                      <ClampLines
                        id={`note${idx}-text`}
                        text={note.text.replace("\n", "")}
                        lines={3}
                        ellipsis="..."
                        buttons={false}
                        className={styles.NoteText}
                        innerElement={"p"}
                      />
                    </Card.Text>
                    <Button variant="primary">Open</Button>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mb-4">
          <h2>Shared with you</h2>
        </Row>
        <Row className="mb-5">
          {sharedNotes.map((note, idx) => (
            <Col key={idx} className="col-3">
              <Card border="success">
                <Link to={`/notes/${note.id}`} className={styles.CardLink}>
                  <Card.Body>
                    <Card.Title>{note.title}</Card.Title>
                    <Card.Subtitle className="text-muted mb-3">
                      <TimeAgo date={note.dateUpdated} />
                    </Card.Subtitle>
                    <Card.Text>
                      <ClampLines
                        id={`note${idx}-text`}
                        text={note.text.replace("\n", "")}
                        lines={3}
                        ellipsis="..."
                        buttons={false}
                        className={styles.NoteText}
                        innerElement={"p"}
                      />
                    </Card.Text>
                    <Button variant="success">Open</Button>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>{" "}
      </Container>
    </main>
  );
};
