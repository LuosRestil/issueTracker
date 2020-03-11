import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import TicketContent from "./TicketContent";

function Dashboard(props) {
  let [issues, setIssues] = useState([]);
  let [assignment, setAssignment] = useState("");

  useEffect(() => {
    if (props.user.role === "user") {
      getIssuesByUser();
    } else if (props.user.role === "support" || props.user.role === "admin") {
      getIssuesBySupport();
    }
  }, [props]);

  const getIssuesByUser = () => {
    fetch(`/api/getUserIssues/${props.user._id}`)
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error);
        } else if (json.data) {
          setIssues(json.data);
        }
      });
  };

  const getIssuesBySupport = () => {
    fetch(`/api/getSupportIssues/${props.user._id}`)
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
          console.log(props.history);
          getIssuesBySupport();
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
          getIssuesBySupport();
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
          getIssuesBySupport();
        }
      });
  };

  const deleteTicket = e => {
    console.log("deleting ticket");
    let id = e.target.parentElement.childNodes[0].childNodes[1].textContent;
    fetch(`/api/deleteIssue/${id}`, { method: "DELETE" })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          console.log(json.error);
        } else if (json.msg) {
          console.log(json.msg);
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
          state: { flashInfo: "Please log in to continue." }
        }}
      />
    );
  } else {
    return (
      <div>
        <h1>My Tickets</h1>
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
        {/* {issues.length < 1 ? (
          <div>No tickets found.</div>
        ) : (
          issues.map(issue => (
            <div className="issueTile" key={issue._id}>
              <p>Ticket ID: {issue._id}</p>
              <h2>
                {issue.title} - ({issue.status})
              </h2>
              <p>{issue.text}</p>
              <p>Department: {issue.department}</p>
              <p>Created by: {issue.createdBy}</p>
              {issue.assignedTo ? <p>Assigned to: {issue.assignedTo}</p> : null}

              {props.user.role === "admin" ? (
                <div>
                  {issue.status === "closed" ? null : issue.assignedTo ? (
                    <form onSubmit={handleAssignment}>
                      <div className="form-group">
                        <label htmlFor="assignSelect">Reassign Support</label>
                        <select
                          className="form-control"
                          id="assignSelect"
                          defaultValue={"DEFAULT"}
                          onChange={e => setAssignment(e.target.value)}
                          required
                        >
                          <option value="DEFAULT" disabled>
                            Select Technician
                          </option>
                          {props.support.map(s => (
                            <option value={s} key={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-secondary mt-2">
                          Reassign
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleAssignment}>
                      <div className="form-group">
                        <label htmlFor="assignSelect">Assign Support</label>
                        <select
                          className="form-control"
                          id="assignSelect"
                          defaultValue={"DEFAULT"}
                          onChange={e => setAssignment(e.target.value)}
                          required
                        >
                          <option value="DEFAULT" disabled>
                            Select Technician
                          </option>
                          {props.support.map(s => (
                            <option value={s} key={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-secondary mt-2">
                          Assign
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : null}
              {props.user.role !== "user" && !issue.assignedTo ? (
                <button onClick={handleClaim}>Claim</button>
              ) : null}
              {issue.status === "closed" ? null : props.user.role !== "user" &&
                issue.assignedTo === props.user.username ? (
                <button className="btn btn-primary m-2" onClick={closeTicket}>
                  Close
                </button>
              ) : null}
              {props.user.role === "admin" ||
              (props.user.role === "user" &&
                issue.createdBy === props.user.username) ? (
                <button className="btn btn-danger m-2" onClick={deleteTicket}>
                  Delete
                </button>
              ) : null}
            </div>
          ))
        )} */}
      </div>
    );
  }
}

export default Dashboard;
