import React from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  useLogoutMutation,
} from "../../generated/graphql";

export const LogoutButton: React.FC = () => {
  const [logout] = useLogoutMutation();
  const history = useHistory();

  return (
    <Button
      variant="outline-danger"
      className="ml-2"
      onClick={async () => {
        await logout({
          update: (store, { data }) => {
            if (!data) {
              return null;
            }
            store.reset();
            store.writeQuery<IsLoggedInQuery>({
              query: IsLoggedInDocument,
              data: {
                isLoggedIn: false,
              },
            });
            history.replace("/");
          },
        });
      }}
    >
      Log Out
    </Button>
  );
};
