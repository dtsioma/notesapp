import { QueryResult } from "@apollo/client";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { useIsLoggedInQuery } from "../../generated/graphql";
import { Login } from "../../views/auth/Login";
import { SignUp } from "../../views/auth/SignUp";
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
      <AuthRoute exact path="/sign-up" component={SignUp} />
      <GuardedRoute exact path="/notes" component={Notes} />
      <GuardedRoute
        exact
        path="/notes/create"
        render={() => <NoteDetail newNote />}
      />
      <GuardedRoute exact path="/notes/:id" component={NoteDetail} />
    </Switch>
  );
};
