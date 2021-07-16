import { ButtonProps } from "react-bootstrap";

export interface ButtonWithClassProps extends ButtonProps {
  buttonClass: string;
}

export interface UserInShared {
  username: string;
}

export interface Note {
  id: number;
  title: string;
  text: string;
  dateCreated: string;
  dateUpdated: string;
  sharedWith: UserInShared[];
}

export interface MatchParams {
  id: string;
}

export interface User {
  username: string;
}
