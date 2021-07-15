import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
  id: string;
}

interface NoteDetailProps extends RouteComponentProps<MatchParams> {}

export const NoteDetail: React.FC<NoteDetailProps> = ({ match }) => {
  return <h3>Note Detail View: {match.params.id}</h3>;
};
