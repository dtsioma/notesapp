import { QueryResult } from "@apollo/client";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useIsLoggedInQuery } from "../../generated/graphql";
import { Login } from "../../views/auth/Login";
import { SignUp } from "../../views/auth/SignUp";
import { Home } from "../../views/Home";
import { NoteDetail } from "../../views/notes/NoteDetail";
import { Notes } from "../../views/notes/Notes";
import { AuthRoute } from "./AuthRoute";
import { GuardedRoute } from "./GuardedRoute";
import { Loading } from "./Loading";

export const Routes: React.FC = () => {
  const { data, loading }: QueryResult = useIsLoggedInQuery();

  if (loading) {
    return <Loading transparent fullScreen />;
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
      <Route path="/">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};
