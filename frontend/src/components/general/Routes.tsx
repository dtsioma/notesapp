import { QueryResult } from "@apollo/client";
import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { Query, useIsLoggedInQuery } from "../../generated/graphql";
import { Login } from "../../views/auth/Login";
import { Home } from "../../views/Home";
import { NoteDetail } from "../../views/notes/NoteDetail";
import { Notes } from "../../views/notes/Notes";
import { AuthRoute } from "./AuthRoute";
import { GuardedRoute } from "./GuardedRoute";

export const Routes: React.FC = () => {
  const { data, loading }: QueryResult = useIsLoggedInQuery();
  if (!loading) {
    console.log(data.isLoggedIn);
  }

  if (loading) {
    return <div></div>;
  }

  return (
    <Switch>
      <Route exact path="/" component={data.isLoggedIn ? Notes : Home} />
      <AuthRoute exact path="/login" component={Login} />
      <GuardedRoute exact path="/notes" component={Notes} />
      <GuardedRoute
        exact
        path="/notes/create"
        render={() => <h3>Create new note here</h3>}
      />
      <GuardedRoute exact path="/notes/:id" component={NoteDetail} />
    </Switch>
  );
};
