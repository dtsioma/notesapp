import React, { useEffect, useState } from "react";
import { Modal, Button, CloseButton, Form, Badge } from "react-bootstrap";
import { User, UserInShared } from "../../utils/interfaces";
import { users } from "../../views/notes/Notes";

interface ShareModalProps {
  show: boolean;
  sharedWith: UserInShared[];
  handleClose: () => void;
  handleSubmit: () => void;
  setSharedWith: (
    arg0: ((sw: UserInShared[]) => UserInShared[]) | UserInShared[]
  ) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  show,
  handleClose,
  handleSubmit,
  sharedWith,
  setSharedWith,
}) => {
  const [searchReq, setSearchReq] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [modalSharedWith, setModalSharedWith] = useState<UserInShared[]>([]);

  useEffect(() => {
    setModalSharedWith(sharedWith);
  }, [sharedWith]);

  const searchUsers = (searchStr: string) => {
    return users.filter(
      (user) =>
        user.username.includes(searchStr) &&
        modalSharedWith.filter((u) => u.username === user.username).length === 0
    );
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Share Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-3 flex-wrap">
          {modalSharedWith.map((u, idx) => (
            <span
              className="d-flex align-items-center me-2 mb-2 btn btn-secondary"
              key={`u-${idx}`}
            >
              <span>{u.username}</span>{" "}
              <CloseButton
                className="ms-1"
                onClick={() => {
                  const mswNew = modalSharedWith.filter(
                    (usr) => usr.username !== u.username
                  );
                  console.log(mswNew);
                  setModalSharedWith(mswNew);
                  setSharedWith(mswNew);
                  setSearchResults(searchUsers(searchReq));
                }}
              />
            </span>
          ))}
        </div>
        <Form className="mb-3">
          <div className="d-flex">
            <Form.Control
              as="input"
              value={searchReq}
              onChange={(e) => {
                setShowResults(false);
                setSearchReq(e.target.value);
                if (e.target.value.length === 0) {
                  console.log("set Search Results to []");
                  setSearchResults([]);
                }
              }}
              placeholder="Search users..."
              style={{ flexGrow: 1 }}
            />
            <Button
              variant="primary"
              className="ms-2"
              onClick={(e) => {
                e.preventDefault();
                if (searchReq.length > 0) {
                  console.log(searchUsers(searchReq).length);
                  setSearchResults(searchUsers(searchReq));
                } else {
                  setSearchResults([]);
                }
                setShowResults(true);
              }}
            >
              Search
            </Button>
          </div>
        </Form>
        <div className="d-flex flex-wrap">
          {
            // check if show results
            showResults ? (
              // check if input is not empty
              searchReq.length > 0 ? (
                // check if search results exist
                searchResults.length > 0 ? (
                  // display results
                  searchResults.map((u, idx) => (
                    <span
                      className="d-flex btn btn-light me-2 mb-2"
                      key={`u-${idx}`}
                    >
                      <span>{u.username}</span>{" "}
                      <CloseButton
                        className="ms-1"
                        onClick={() => {
                          const usw: UserInShared = { username: u.username };
                          const newSR = searchResults.filter(
                            (usr) => usr.username !== u.username
                          );
                          console.log(`newSR ${newSR}`);
                          setSearchResults(newSR);
                          setModalSharedWith((msw) => [...msw, usw]);
                          setSharedWith((sw: UserInShared[]) => {
                            return [...sw, usw];
                          });
                        }}
                      />
                    </span>
                  ))
                ) : (
                  // search results don't exist
                  <div>No users found. Try different search.</div>
                )
              ) : // input is empty
              null
            ) : // not showing results
            null
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={() => {
            setSearchReq("");
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
