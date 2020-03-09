import React, { useState } from "react";
import { Redirect } from "react-router-dom";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState({
    redirect: false,
    path: "",
    msg: ""
  });
  const [flashError, setFlashError] = useState("");

  let flashSuccess;
  try {
    flashSuccess = props.location.state.flashSuccess;
  } catch {}

  let flashInfo;
  try {
    flashInfo = props.location.state.flashInfo;
  } catch {}

  const handleSubmit = async e => {
    e.preventDefault();
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    };
    fetch("/api/login", options)
      .then(response => response.json())
      .then(json => {
        setUsername("");
        setPassword("");
        if (json.error) {
          props.location.state.flashSuccess = "";
          setFlashError(json.error);
        } else if (json.user) {
          window.localStorage.setItem("qrs", json.user);
          props.setLogged(true);
          setRedirect({
            redirect: true,
            path: "/dashboard",
            msg: "Login successful!"
          });
        }
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
        <h1>Login</h1>
        {flashSuccess ? (
          <div className="alert alert-success">{flashSuccess}</div>
        ) : flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : flashInfo ? (
          <div className="alert alert-info">{flashInfo}</div>
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

export default Login;
