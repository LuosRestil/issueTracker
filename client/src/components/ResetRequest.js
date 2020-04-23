import React, { useState } from "react";

function ResetRequest(props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [flashError, setFlashError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    };
    fetch("/api/resetRequest", options)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.error);
          setFlashError(json.error);
        } else {
          setSent(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // * TODO * if props.logged, redirect to normal pw reset page
  if (sent) {
    return (
      <div className="request-reset-success">
        <p className="h5">
          An email has been sent to your inbox with instructions for resetting
          your password.
        </p>
      </div>
    );
  } else {
    return (
      <div>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <h1 className="mt-3">Request Password Reset</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailField">Enter your email address</label>
            <input
              type="email"
              className="form-control"
              id="emailField"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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

export default ResetRequest;
