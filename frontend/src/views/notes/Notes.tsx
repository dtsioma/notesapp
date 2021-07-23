import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ClampLines from "react-clamp-lines";
import TimeAgo from "react-timeago";
import styles from "./Notes.module.css";
import { Note, User } from "../../utils/interfaces";
import { useNotesByCurrentAuthorQuery } from "../../generated/graphql";
import { QueryResult } from "@apollo/client";
import { Loading } from "../../components/general/Loading";

export const Notes: React.FC = () => {
  const { data, loading }: QueryResult = useNotesByCurrentAuthorQuery();
  const [notes, setNotes] = useState<JSX.Element[] | null>(null);

  console.log("notes rerender");

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

  const sortNotesByNew = (a: Note, b: Note) => {
    if (Date.parse(b.dateUpdated) > Date.parse(a.dateUpdated)) return 1;
    else if (Date.parse(a.dateUpdated) > Date.parse(b.dateUpdated)) return -1;
    else return 0;
  };

  // rerender if notes list changed
  useEffect(() => {
    console.log(data);
    if (data && data.notesByAuthor.length !== 0) {
      const newNotes = [...data.notesByAuthor]
        .sort(sortNotesByNew)
        .map((note: Note, idx: number) => (
          <Col key={idx} className="col col-sm-6 col-lg-3 mt-3">
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
        ));
      console.log({ newNotes });
      setNotes(newNotes);
    }
    console.log({ notes });
  }, [data]);

  if (loading) {
    return <Loading transparent fullScreen />;
  }

  return (
    <main className={styles.Notes}>
      <Container>
        <Row className="mb-2 mb-md-4">
          <h2>
            Your Notes
            {data.notesByAuthor.length > 0 ? (
              <Link to="/notes/create">
                <Button variant="success" className="ms-3">
                  Create Note
                </Button>
              </Link>
            ) : null}
          </h2>
        </Row>
        <Row className={["mb-5", styles.ColumnXS].join(" ")}>
          {data && data.notesByAuthor.length !== 0 ? notes : createNoteCard}
        </Row>
      </Container>
    </main>
  );
};
