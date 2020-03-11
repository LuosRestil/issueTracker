import React, { useState } from "react";
import { Redirect } from "react-router-dom";

function SubmitIssue(props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [department, setDepartment] = useState("");
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
      body: JSON.stringify({ department: department, title: title, text: text })
    };
    fetch("/api/submitIssue", options)
      .then(response => response.json())
      .then(json => {
        setTitle("");
        setText("");
        if (json.error) {
          setFlashError(json.error);
        } else if (json.msg) {
          setRedirect({
            redirect: true,
            path: "/",
            msg: json.msg
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
        <h1>Submit Support Ticket</h1>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="deptField">Department</label>
            <select
              className="form-control"
              id="deptField"
              onChange={e => setDepartment(e.target.value)}
              defaultValue={"DEFAULT"}
              required
            >
              <option value="DEFAULT" disabled>
                Select Department
              </option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="janitorial">Janitorial</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="titleField">Title</label>
            <input
              type="text"
              className="form-control"
              id="titleField"
              onChange={e => setTitle(e.target.value)}
              value={title}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="textArea">Please explain your issue here</label>
            <textarea
              className="form-control"
              id="textArea"
              onChange={e => setText(e.target.value)}
              value={text}
              rows="5"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default SubmitIssue;
