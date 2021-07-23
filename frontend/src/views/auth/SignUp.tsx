import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  MeDocument,
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../../generated/graphql";
import styles from "./Auth.module.css";

export const SignUp: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailFeedback, setEmailFeedback] =
    useState<string>("Enter valid email.");
  const [passwordFeedback, setPasswordFeedback] = useState<string>(
    "Enter valid password."
  );
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const history = useHistory();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      try {
        await register({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }
            (async () => {
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
            })();
            history.replace("/");
          },
        });
      } catch (err) {
        if (err.message === "User already exists") {
          setEmailFeedback("User with such email already exist.");
          setPasswordFeedback("");
          setEmail("");
          setPassword("");
        }
      }
    }

    setValidated(true);
  };

  return (
    <div className={styles.Auth}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h3 className="mb-3">Sign Up</h3>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            type="email"
            placeholder="Enter email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
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
            }}
          />
          <Form.Control.Feedback type="invalid">
            {passwordFeedback}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex align-items-center justify-content-between">
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
          <Link to="/login" style={{ textDecoration: "none" }}>
            Go to Login
          </Link>
        </div>
      </Form>
    </div>
  );
};
