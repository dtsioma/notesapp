import React from "react";
import Button from "react-bootstrap/Button";
import { useLogoutMutation } from "../../generated/graphql";

export const LogoutButton: React.FC = () => {
  const [logout, { client }] = useLogoutMutation();
  return (
    <Button
      variant="outline-danger"
      className="ml-2"
      onClick={async () => {
        await logout();
        await client.resetStore();
      }}
    >
      Log Out
    </Button>
  );
};
