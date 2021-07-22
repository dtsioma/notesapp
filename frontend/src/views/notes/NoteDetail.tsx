import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { myNotes } from "./Notes";
import styles from "./NoteDetail.module.css";
import TimeAgo from "react-timeago";
import { MatchParams, Note } from "../../utils/interfaces";
import { shallowEqual } from "../../utils/areObjectsEqual";
import { CancelChangesModal } from "../../components/notes/CancelChangesModal";
import { DeleteModal } from "../../components/notes/DeleteModal";
import {
  useCreateNoteMutation,
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
} from "../../generated/graphql";

interface NoteDetailProps {
  newNote: boolean;
}

export const NoteDetail: React.FC<NoteDetailProps> = ({ newNote }) => {
  const { id: noteId } = useParams<{ id: string }>();
  const [showDateEdited, setShowDateEdited] = useState<boolean>(true);
  const [editingMode, setEditingMode] = useState<boolean>(newNote);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [showCCModal, setShowCCModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const history = useHistory();

  const [title, setTitle] = useState<string>();
  const [text, setText] = useState<string>();
  const [noteContent, setNoteContent] = useState<Note | null>(null);

  const [showEditedToast, setShowEditedToast] = useState<boolean>(false);

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();

  const { data, loading } = useGetNoteByIdQuery({ variables: { noteId } });

  // Get Note object
  useEffect(() => {
    // set empty content if note is new
    if (newNote) {
      setNoteContent({
        title: "",
        text: "",
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        id: "999999999999", // don't care
      });
      setTitle("");
      setText("");
      return;
    }
    console.log({ data, loading });
    if (data) {
      setNoteContent(data.noteById);
      setTitle(data.noteById.title);
      setText(data.noteById.text);
      console.log("note content set successfully");
    }
    if (!data && !loading) {
      history.replace("/");
    }
  }, [noteId, data, loading]);

  // check if Note is edited
  const noteIsEdited = () => {
    if (noteContent === null) {
      throw new Error("Note content is null");
    }
    const result = !shallowEqual(
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
  }, [title, text, noteContent]);

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

  const handleSave = async () => {
    if (!title) {
      setTitle("No Title");
      return;
    }
    if (!text) {
      setText("No Text");
      return;
    }
    setEditingMode(false);
    // create new note
    if (newNote) {
      try {
        await createNote({
          variables: { title, text },
          update: (store) => {
            store.reset();
            history.replace("/");
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
    // save changes to existing note
    try {
      await updateNote({
        variables: { id: noteId, title, text },
        update: (store, { data }) => {
          store.reset();
          setShowEditedToast(true);
          setTimeout(() => {
            setShowEditedToast(false);
          }, 3000);
          console.log("note edited successfully");
        },
      });
    } catch (err) {
      console.log(err);
    }
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
                placeholder="Enter title"
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
                  placeholder="Enter text"
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
                  {!newNote ? (
                    <ListGroup variant="flush">
                      <ListGroup.Item
                        onClick={() => setShowDateEdited((x) => !x)}
                      >
                        {sidebarDate}
                      </ListGroup.Item>
                    </ListGroup>
                  ) : null}
                  <Card.Body>
                    <div className="d-grid gap-2">
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
                          variant="warning"
                          onClick={() => {
                            setEditingMode(true);
                          }}
                        >
                          Edit
                        </Button>
                      )}

                      {editingMode ? (
                        <Button
                          variant="success"
                          onClick={handleSave}
                          disabled={!isEdited}
                        >
                          Save
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
      <ToastContainer className="p-3" position="top-center">
        <Toast show={showEditedToast}>
          <Toast.Body>Changes saved successfully</Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
};
