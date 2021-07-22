import React from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ClampLines from "react-clamp-lines";
import TimeAgo from "react-timeago";
import styles from "./Notes.module.css";
import { Note, User } from "../../utils/interfaces";
import { useNotesByCurrentAuthorQuery } from "../../generated/graphql";
import { QueryResult } from "@apollo/client";

export const Notes: React.FC = () => {
  const { data, loading }: QueryResult = useNotesByCurrentAuthorQuery();
  console.log(data);

  const createNoteCard = (
    <Col className="col-6">
      <Card className="text-center">
        <Link to="/notes/create" className={styles.CardLink}>
          <Card.Body>
            <Card.Title className="mb-4">
              <h3>Click to create your first note!</h3>
            </Card.Title>
            <Button variant="primary">Let's go</Button>
          </Card.Body>
        </Link>
      </Card>
    </Col>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.Notes}>
      <Container>
        <Row className="mb-4">
          <h2>Your Notes</h2>
        </Row>
        <Row className="mb-5">
          {data && data.notesByAuthor.length !== 0
            ? data.notesByAuthor.map((note: Note, idx: number) => (
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
              ))
            : createNoteCard}
        </Row>
      </Container>
    </main>
  );
};

export const users: User[] = [
  { username: "johndoe" },
  { username: "mary_smith" },
  { username: "christianbale" },
  { username: "user1" },
  { username: "user2" },
  { username: "user3" },
  { username: "newuser" },
  { username: "another_user" },
];

export const myNotes: Note[] = [
  {
    id: 1,
    title: "First note",
    text: "Hello!\n\nThis is my first note!",
    dateCreated: "Wed Jul 14 2021 17:31:25 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 20:49:08 GMT-0700 (PDT)",
  },
  {
    id: 2,
    title: "Another note",
    text: "Ok\n\nhere we go\n\nanother note by me",
    dateCreated: "Wed Jul 14 2021 17:35:23 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:35:23 GMT-0700 (PDT)",
  },
  {
    id: 3,
    title: "This is my first note",
    text: "Hello Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ab. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores vero dolorum similique provident ducimus natus, error sunt quae est sit!!\n\nThis is my first note!",
    dateCreated: "Wed Jul 14 2021 17:35:44 GMT-0700 (PDT)",
    dateUpdated: "Wed Jul 14 2021 17:35:44 GMT-0700 (PDT)",
  },
];

myNotes.sort((a: Note, b: Note) => {
  if (Date.parse(b.dateUpdated) > Date.parse(a.dateUpdated)) return 1;
  else if (Date.parse(a.dateUpdated) > Date.parse(b.dateUpdated)) return -1;
  else return 0;
});
