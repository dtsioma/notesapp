import { QueryResult } from "@apollo/client";
import React from "react";
import Button from "react-bootstrap/Button";
import { useMeQuery } from "../../generated/graphql";

export const UsernameButton: React.FC = () => {
  const { data, loading }: QueryResult = useMeQuery();

  if (loading) {
    return <div></div>;
  }

  return (
    <Button variant="light" className="me-2">
      {data.me.email}
    </Button>
  );
};
