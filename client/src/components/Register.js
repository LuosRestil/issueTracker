import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState({
    redirect: false,
    path: "",
    msg: ""
  });
  const [flashError, setFlashError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      })
    };
    fetch("/api/register", options)
      .then(response => response.json())
      .then(json => {
        setUsername("");
        setPassword("");
        if (json.error) {
          setFlashError(json.error);
        } else if (json.msg) {
          setRedirect({
            redirect: true,
            path: "/login",
            msg: "Registration successful! You may now log in."
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  if (redirect.redirect) {
    return (
      <Redirect
        to={{
          pathname: redirect.path,
          state: { flashSuccess: redirect.msg }
        }}
      />
    );
  } else {
    return (
      <div>
        <h1 className="mt-3">Registration</h1>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameField">Username</label>
            <input
              type="username"
              className="form-control"
              id="usernameField"
              onChange={e => setUsername(e.target.value)}
              value={username}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailField">Email</label>
            <input
              type="email"
              className="form-control"
              id="emailField"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordField">Password</label>
            <input
              type="password"
              className="form-control"
              id="passwordField"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <p className="mt-4">
          Already have an account? <Link to="/login">Log in</Link>.
        </p>
      </div>
    );
  }
}

export default Register;
