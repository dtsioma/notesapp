import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { AuthContext } from "../../App";
import { Home } from "../../views/Home";
import { NoteDetail } from "../../views/NoteDetail";
import { Notes } from "../../views/Notes";
import { GuardedRoute } from "./GuardedRoute";

export const Routes: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Switch>
      <Route exact path="/" component={isAuthenticated ? Notes : Home} />
      <GuardedRoute exact path="/notes" component={Notes} />
      <GuardedRoute exact path="/notes/:id" component={NoteDetail} />
    </Switch>
  );
};
