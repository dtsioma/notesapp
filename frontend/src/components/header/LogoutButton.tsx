import React from "react";
import Button from "react-bootstrap/Button";

export const LogoutButton: React.FC = () => {
  return (
    <Button variant="outline-danger" className="ml-2">
      Log Out
    </Button>
  );
};
