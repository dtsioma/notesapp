import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Form,
} from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import { myNotes } from "./Notes";
import styles from "./NoteDetail.module.css";
import TimeAgo from "react-timeago";
import { MatchParams, Note, UserInShared } from "../../utils/interfaces";
import deepEqual from "../../utils/deepEqual";
import { CancelChangesModal } from "../../components/notes/CancelChangesModal";
import { DeleteModal } from "../../components/notes/DeleteModal";
import { ShareModal } from "../../components/notes/ShareModal";

interface NoteDetailProps extends RouteComponentProps<MatchParams> {}

export const NoteDetail: React.FC<NoteDetailProps> = ({ match }) => {
  const [showDateEdited, setShowDateEdited] = useState<boolean>(true);
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [showCCModal, setShowCCModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const [title, setTitle] = useState<string>();
  const [text, setText] = useState<string>();
  const [sharedWith, setSharedWith] = useState<UserInShared[]>();
  const [noteContent, setNoteContent] = useState<Note | null>(null);

  // Get Note object
  const noteId = Number(match.params.id);
  useEffect(() => {
    const note = myNotes.filter((x) => x.id === noteId)[0];
    setNoteContent(note);
    setTitle(note.title);
    setText(note.text);
    setSharedWith(note.sharedWith);
  }, [noteId]);

  // check if Note is edited
  const noteIsEdited = () => {
    if (noteContent === null) {
      throw new Error("Note content is null");
    }
    const result = !deepEqual(
      {
        title: noteContent.title,
        text: noteContent.text,
      },
      { title, text }
    );
    console.log(result);
    return result;
  };

  // call noteIsEdited on each field change
  useEffect(() => {
    if (
      title === undefined ||
      text === undefined ||
      noteContent === null ||
      (title === noteContent.title && text === noteContent.text)
    ) {
      console.log(false);
      setIsEdited(false);
    } else {
      console.log(true);
      setIsEdited(true);
    }
  }, [title, text]);

  // Stitch Edited/Created/Loading  in sidebar
  let sidebarDate: React.ReactElement | string = "Loading...";
  if (noteContent) {
    sidebarDate = showDateEdited ? (
      <React.Fragment>
        Edited: <TimeAgo date={noteContent.dateUpdated} />
      </React.Fragment>
    ) : (
      <React.Fragment>
        Created: <TimeAgo date={noteContent.dateCreated} />
      </React.Fragment>
    );
  }

  const cancelChanges = () => {
    if (noteContent === null) {
      throw new Error("Note content is null");
    }
    setEditingMode(false);
    setTitle(noteContent.title);
    setText(noteContent.text);
  };

  return (
    <main className={styles.NoteView}>
      <Container>
        {!noteContent ? (
          <h3>Loading...</h3>
        ) : (
          <React.Fragment>
            <Row className="mt-5 mb-3">
              <Form.Control
                as="input"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                readOnly={!editingMode}
                className={styles.Title}
              />
            </Row>
            <Row>
              {/* NOTE CONTENT */}
              <Col className="col-9">
                <Form.Control
                  as="textarea"
                  id="NoteTextArea"
                  value={text}
                  readOnly={!editingMode}
                  rows={10}
                  className={styles.Textarea}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                >
                  {noteContent.text}
                </Form.Control>
              </Col>
              {/* SIDEBAR */}
              <Col className="col-3">
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item
                      onClick={() => setShowDateEdited((x) => !x)}
                    >
                      {sidebarDate}
                    </ListGroup.Item>
                    <ListGroup.Item onClick={() => setShowShareModal(true)}>
                      {sharedWith && sharedWith.length ? (
                        <React.Fragment>
                          Shared with:{" "}
                          {sharedWith.map((u, idx) => (
                            <Badge key={idx} className="me-1 bg-secondary">
                              {u.username}
                            </Badge>
                          ))}
                        </React.Fragment>
                      ) : (
                        "Share this note"
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button
                        variant={editingMode ? "success" : "warning"}
                        onClick={
                          editingMode
                            ? () => {
                                console.log("saved successfully");
                              }
                            : () => {
                                setEditingMode(true);
                              }
                        }
                        disabled={editingMode && !isEdited}
                      >
                        {editingMode ? "Save" : "Edit"}
                      </Button>
                      {editingMode ? (
                        <Button
                          variant="warning"
                          onClick={() => {
                            if (noteIsEdited()) {
                              setShowCCModal(true);
                            } else {
                              cancelChanges();
                            }
                          }}
                        >
                          Cancel changes
                        </Button>
                      ) : (
                        <Button
                          variant="outline-danger"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Container>
      <CancelChangesModal
        show={showCCModal}
        handleClose={() => {
          setShowCCModal(false);
        }}
        handleSubmit={() => {
          cancelChanges();
          setShowCCModal(false);
        }}
      />
      <DeleteModal
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
        }}
        handleSubmit={() => {
          console.log("note deleted");
          setShowDeleteModal(false);
        }}
      />
      <ShareModal
        show={showShareModal}
        handleClose={() => {
          setShowShareModal(false);
        }}
        handleSubmit={() => {
          console.log("perms saved");
          setShowShareModal(false);
        }}
        sharedWith={sharedWith || []}
      />
    </main>
  );
};
