import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import TicketContent from "./TicketContent";

function Dashboard(props) {
  let [issues, setIssues] = useState([]);
  let [assignment, setAssignment] = useState("");

  let flashError;
  try {
    flashError = props.location.state.flashError;
  } catch {}

  useEffect(() => {
    if (props.user.role === "user") {
      getIssuesByUser();
    } else if (props.user.role === "support" || props.user.role === "admin") {
      getIssuesBySupport();
    }
  }, [props]);

  const getIssuesByUser = () => {
    fetch(`/api/getUserIssues/${props.user._id}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.error);
        } else if (json.data) {
          setIssues(json.data);
        }
      });
  };

  const getIssuesBySupport = () => {
    fetch(`/api/getSupportIssues/${props.user._id}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.error);
        } else if (json.data) {
          setIssues(json.data);
        }
      });
  };

  const handleAssignment = (e) => {
    e.preventDefault();
    let jsonAssignment = JSON.parse(assignment);
    let id =
      e.target.parentElement.parentElement.childNodes[0].childNodes[1]
        .textContent;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignment: jsonAssignment }),
    };
    fetch(`/api/assignment/${id}`, options)
      .then((response) => response.json())
      .then((json) => {
        // Select element not resetting
        // setAssignment("DEFAULT");
        if (json.error) {
        } else if (json.msg) {
          getIssuesBySupport();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClaim = (e) => {
    e.preventDefault();
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: props.user }),
    };
    fetch(`/api/claimIssue/${id}`, options)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          getIssuesBySupport();
        }
      });
  };

  const closeTicket = (e) => {
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    fetch(`/api/closeIssue/${id}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          getIssuesBySupport();
        }
      });
  };

  const deleteTicket = (e) => {
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    fetch(`/api/deleteIssue/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          if (props.user.role === "user") {
            getIssuesByUser();
          } else {
            getIssuesBySupport();
          }
        }
      });
  };

  if (!props.logged) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { flashInfo: "Please log in to continue." },
        }}
      />
    );
  } else {
    return (
      <div>
        {flashError ? (
          <div className="alert alert-danger">{flashError}</div>
        ) : null}
        <h1 className="mt-3">My Tickets</h1>
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
}

export default Dashboard;
