import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import TicketContent from "./TicketContent";

const UserSearch = props => {
  let [issues, setIssues] = useState([]);
  let [assignment, setAssignment] = useState("");
  let [search, setSearch] = useState("");
  let [flashError, setFlashError] = useState("");

  const getIssues = () => {
    fetch(`/api/getIssues/${props.match.params.department}`)
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error);
        } else if (json.data) {
          setIssues(json.data);
        }
      });
  };

  const handleAssignment = e => {
    e.preventDefault();
    let jsonAssignment = JSON.parse(assignment);
    let id =
      e.target.parentElement.parentElement.childNodes[0].childNodes[1]
        .textContent;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignment: jsonAssignment })
    };
    fetch(`/api/assignment/${id}`, options)
      .then(response => response.json())
      .then(json => {
        // Select element not resetting
        // setAssignment("DEFAULT");
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          getIssues();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleClaim = e => {
    e.preventDefault();
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: props.user.username })
    };
    fetch(`/api/claimIssue/${id}`, options)
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          getIssues();
        }
      });
  };

  const closeTicket = e => {
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    fetch(`/api/closeIssue/${id}`)
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          getIssues();
        }
      });
  };

  const deleteTicket = e => {
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    fetch(`/api/deleteIssue/${id}`, { method: "DELETE" })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          getIssues();
        }
      });
  };

  const searchByUser = e => {
    e.preventDefault();
    fetch(`/api/getIssuesByUser/${search}`)
      .then(response => response.json())
      .then(json => {
        setSearch("");
        if (json.error) {
          setFlashError(json.error);
          console.log(json.error);
        } else if (json.data) {
          setFlashError("");
          setIssues(json.data);
        }
      });
  };

  if (!props.logged) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { flashInfo: "Please log in to continue." }
        }}
      />
    );
  } else if (props.user.role === "user" || props.user.role === "support") {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { flashError: "You are not authorized to view that page." }
        }}
      />
    );
  } else {
    return (
      <div>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <h1 className="mt-3">Search By User</h1>
        <form onSubmit={searchByUser} className="mb-3">
          <div className="form-group">
            <label htmlFor="searchField">Search By Username</label>
            <input
              type="text"
              className="form-control"
              id="usernameField"
              onChange={e => setSearch(e.target.value)}
              value={search}
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <TicketContent
          handleClaim={handleClaim}
          deleteTicket={deleteTicket}
          closeTicket={closeTicket}
          setAssignment={setAssignment}
          issues={issues}
          user={props.user}
          support={props.support}
          handleAssignment={handleAssignment}
        />
      </div>
    );
  }
};

export default UserSearch;
