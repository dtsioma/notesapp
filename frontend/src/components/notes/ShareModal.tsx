import React, { useState } from "react";
import { Modal, Button, CloseButton, Form } from "react-bootstrap";
import { UserInShared } from "../../utils/interfaces";

interface ShareModalProps {
  show: boolean;
  sharedWith: UserInShared[];
  handleClose: () => void;
  handleSubmit: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  show,
  handleClose,
  handleSubmit,
  sharedWith,
}) => {
  const [searchReq, setSearchReq] = useState<string>("");

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Share Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-3">
          {sharedWith.map((u) => (
            <Button className="d-flex align-items-center me-2" variant="light">
              <span>{u.username}</span> <CloseButton className="ms-1" />
            </Button>
          ))}
        </div>
        <Form>
          <Form.Control
            as="input"
            value={searchReq}
            onChange={(e) => setSearchReq(e.target.value)}
            placeholder="Search users..."
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
