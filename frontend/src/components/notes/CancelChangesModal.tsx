import React from "react";
import { Modal, Button } from "react-bootstrap";

interface CancelChangesModalProps {
  show: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

export const CancelChangesModal: React.FC<CancelChangesModalProps> = ({
  show,
  handleClose,
  handleSubmit,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Unsaved changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to cancel these changes?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={handleClose}>
          No, go back
        </Button>
        <Button variant="warning" onClick={handleSubmit}>
          Yes, cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
