import React, { useState } from "react";
import { Redirect } from "react-router-dom";

function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      body: JSON.stringify({ username: username, password: password })
    };
    fetch("/api/register", options)
      .then(response => response.json())
      .then(json => {
        setUsername("");
        setPassword("");
        if (json.error) {
          setFlashError(json.error);
        } else if (json.user) {
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
    console.log("redirecting to login...");
    return (
      <Redirect
        to={{
          pathname: redirect.path,
          state: { flashSuccess: redirect.msg }
        }}
      />
    );
  } else {
    console.log("not redirecting to login...");
    return (
      <div>
        <h1>Registration</h1>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Username</label>
            <input
              type="username"
              className="form-control"
              id="exampleInputEmail1"
              onChange={e => setUsername(e.target.value)}
              value={username}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Register;
