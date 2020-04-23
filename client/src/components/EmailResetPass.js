import React, { useState } from "react";
import { Redirect } from "react-router-dom";

function EmailResetPass(props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState({
    redirect: false,
    path: "",
    msg: "",
  });
  const [flashError, setFlashError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        confirmPassword: confirmPassword,
        token: props.match.params.token,
      }),
    };
    fetch("/api/emailResetPass", options)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          setFlashError(json.error);
        } else {
          setRedirect({ redirect: true, path: "/login", msg: json.msg });
        }
      });
  };

  if (redirect.redirect) {
    return (
      <Redirect
        to={{
          pathname: redirect.path,
          state: { flashSuccess: redirect.msg },
        }}
      />
    );
  } else {
    return (
      <div>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <h1 className="mt-3">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="passwordField">New Password</label>
            <input
              type="password"
              className="form-control"
              id="passwordField"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordField">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPasswordField"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
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

export default EmailResetPass;
