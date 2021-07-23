import { QueryResult } from "@apollo/client";
import React from "react";
import { Route, RouteProps, useHistory } from "react-router-dom";
import { useIsLoggedInQuery } from "../../generated/graphql";

export const AuthRoute: React.FC<RouteProps> = (props) => {
  const {
    data: { isLoggedIn },
    loading,
  }: QueryResult = useIsLoggedInQuery();
  const history = useHistory();

  if (isLoggedIn && !loading) {
    history.replace("/");
  }

  return <Route {...props} />;
};
