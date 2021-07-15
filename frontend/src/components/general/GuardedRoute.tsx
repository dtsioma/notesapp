import React, { useContext } from "react";
import { Route, RouteProps, useHistory } from "react-router-dom";
import { AuthContext } from "../../App";

export const GuardedRoute: React.FC<RouteProps> = (props) => {
  const { isAuthenticated } = useContext(AuthContext);
  console.log(isAuthenticated);
  const history = useHistory();

  if (!isAuthenticated) {
    history.replace("/");
  }

  return <Route {...props} />;
};
