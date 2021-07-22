import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../../generated/graphql";
import styles from "./Auth.module.css";

export const Login: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailFeedback, setEmailFeedback] =
    useState<string>("Enter valid email.");
  const [passwordFeedback, setPasswordFeedback] = useState<string>(
    "Enter valid password."
  );
  const [login] = useLoginMutation();
  const history = useHistory();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      try {
        await login({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                me: {
                  id: data.login.id,
                  email: data.login.email,
                },
              },
            });
            store.writeQuery<IsLoggedInQuery>({
              query: IsLoggedInDocument,
              data: {
                isLoggedIn: true,
              },
            });
            history.replace("/");
          },
        });
      } catch (err) {
        console.log(err);
        if (err.message === "User not found") {
          setEmailFeedback("User with such email does not exist.");
          setPasswordFeedback("");
        }
        if (err.message === "Password is incorrect") {
          setPasswordFeedback("Enter correct password.");
          setEmailFeedback("");
        }
        setPassword("");
      }
    }

    setValidated(true);
  };

  return (
    <div className={styles.Auth}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h3 className="mb-3">Log In</h3>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            type="email"
            placeholder="Enter email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailFeedback("Enter valid email.");
            }}
          />
          <Form.Control.Feedback type="invalid">
            {emailFeedback}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            type="password"
            placeholder="Password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordFeedback("Enter valid password.");
            }}
          />
          <Form.Control.Feedback type="invalid">
            {passwordFeedback}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex align-items-center justify-content-between">
          <Button variant="primary" type="submit">
            Log In
          </Button>
          <Link to="/sign-up" style={{ textDecoration: "none" }}>
            Go to Sign Up
          </Link>
        </div>
      </Form>
    </div>
  );
};
