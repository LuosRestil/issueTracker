import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import TicketContent from "./TicketContent";

const AllTickets = props => {
  console.log("in AllTickets route...");
  let [issues, setIssues] = useState([]);
  let [assignment, setAssignment] = useState("");

  useEffect(() => {
    console.log("allTickets useEffect...");
    getIssues();
  }, []);

  const getIssues = () => {
    fetch("/api/getAllIssues")
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
    let id =
      e.target.parentElement.parentElement.childNodes[0].childNodes[1]
        .textContent;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignment: assignment })
    };
    fetch(`/api/assignment/${id}`, options)
      .then(response => response.json())
      .then(json => {
        // Select element not resetting
        setAssignment("DEFAULT");
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
      })
      .catch(err => {
        console.log(err);
      });
  };

  const closeTicket = e => {
    e.preventDefault();
    let id =
      e.target.parentElement.parentElement.childNodes[0].childNodes[1]
        .textContent;
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

  if (!props.logged) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { flashInfo: "Please log in to continue." }
        }}
      />
    );
  } else if (props.user.role === "user") {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { flashInfo: "You are not authorized to view that page." }
        }}
      />
    );
  } else {
    return (
      <div>
        <h1>All Tickets</h1>
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

export default AllTickets;
