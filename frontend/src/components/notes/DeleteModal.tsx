import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  handleClose,
  handleSubmit,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Delete Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this note? Deleted notes cannot be
        restored.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={handleClose}>
          No, go back
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Yes, delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
