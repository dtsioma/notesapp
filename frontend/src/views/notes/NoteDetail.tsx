import React, { useEffect, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
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
import styles from "./NoteDetail.module.css";
import TimeAgo from "react-timeago";
import { Note } from "../../utils/interfaces";
import { shallowEqual } from "../../utils/areObjectsEqual";
import { CancelChangesModal } from "../../components/notes/CancelChangesModal";
import { DeleteModal } from "../../components/notes/DeleteModal";
import { Loading } from "../../components/general/Loading";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
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

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>("");

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

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
    if (data) {
      setNoteContent(data.noteById);
      setTitle(data.noteById.title);
      setText(data.noteById.text);
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
      setIsEdited(false);
    } else {
      setIsEdited(true);
    }
  }, [title, text, noteContent]);

  // Switch Edited/Created/Loading  in sidebar
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
    if (newNote) {
      history.replace("/");
    }
    if (noteContent === null) {
      throw new Error("Note content is null");
    }
    setEditingMode(false);
    setTitle(noteContent.title);
    setText(noteContent.text);
  };

  const displayToast = (text: string) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
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
          displayToast("Changes saved successfully.");
        },
      });
    } catch (err) {
      displayToast("There was an error. Try again later.");
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote({
        variables: { id: noteId },
        update: (store, { data }) => {
          if (data && data.deleteNote) {
            store.reset();
            history.replace("/");
          } else {
            displayToast("There was an error. Try again later.");
          }
        },
      });
    } catch {
      displayToast("There was an error. Try again later.");
    }
  };

  return (
    <main className={styles.NoteView}>
      <Container>
        {!noteContent ? (
          <Loading fullScreen transparent />
        ) : (
          <React.Fragment>
            <Row className="mt-md-3 mt-lg-5 mb-sm-2 mb-lg-3">
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
            <Row className={styles.Wrapper}>
              {/* NOTE CONTENT */}
              <Col className="col-md-8 col-lg-9">
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
              <Col className={["col-md-4 col-lg-3", styles.Sidebar].join(" ")}>
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
          handleDelete();
          setShowDeleteModal(false);
        }}
      />
      <ToastContainer className="p-3" position="top-center">
        <Toast show={showToast} bg="light">
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
};
