import React from "react";

const TicketContent = (props) => {
  return (
    <div className="ticket-content">
      {props.issues.length < 1 ? (
        <div>No tickets found.</div>
      ) : (
        props.issues.map((issue) => (
          <div
            className={
              issue.status === "new"
                ? "issue-tile-new"
                : issue.status === "closed"
                ? "issue-tile-closed"
                : "issue-tile"
            }
            key={issue._id}
          >
            <p>Ticket ID: {issue._id}</p>
            <h2>
              {issue.title} - ({issue.status})
            </h2>
            <p>{issue.text}</p>
            <p>Department: {issue.department}</p>
            <p>
              Created by: {issue.createdBy.username}, {issue.createdBy.email}
            </p>
            <p>
              Opened:{" "}
              {issue.dateTimeCreated.split("T")[0] +
                " at " +
                issue.dateTimeCreated.split("T")[1].slice(0, 5)}
            </p>{" "}
            {issue.assignedTo ? (
              <p>
                Assigned to: {issue.assignedTo.username},{" "}
                {issue.assignedTo.email}
              </p>
            ) : null}
            {props.user.role === "admin" ? (
              <div>
                {issue.status === "closed" ? null : issue.assignedTo ? (
                  <form onSubmit={props.handleAssignment}>
                    <div className="form-group">
                      <label htmlFor="assignSelect">Reassign Support</label>
                      <select
                        className="form-control"
                        id="assignSelect"
                        defaultValue={"DEFAULT"}
                        onChange={(e) => props.setAssignment(e.target.value)}
                        required
                      >
                        <option value="DEFAULT" disabled>
                          Select Technician
                        </option>
                        {props.support.map((s) => (
                          <option value={JSON.stringify(s)} key={s.username}>
                            {s.username}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-secondary mt-2">
                        Reassign
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={props.handleAssignment}>
                    <div className="form-group">
                      <label htmlFor="assignSelect">Assign Support</label>
                      <select
                        className="form-control"
                        id="assignSelect"
                        defaultValue={"DEFAULT"}
                        onChange={(e) => props.setAssignment(e.target.value)}
                        required
                      >
                        <option value="DEFAULT" disabled>
                          Select Technician
                        </option>
                        {props.support.map((s) => (
                          <option value={JSON.stringify(s)} key={s.username}>
                            {s.username}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-secondary mt-2">Assign</button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}
            {props.user.role !== "user" && !issue.assignedTo ? (
              <button className="btn btn-success" onClick={props.handleClaim}>
                Claim
              </button>
            ) : null}
            {issue.status === "closed" ? null : !issue.assignedTo ? null : issue
                .assignedTo.username === props.user.username ? (
              <button
                className="btn btn-primary m-2"
                onClick={props.closeTicket}
              >
                Close
              </button>
            ) : null}
            {props.user.role === "admin" ||
            (props.user.role === "user" &&
              issue.createdBy.username === props.user.username) ? (
              <button
                className="btn btn-danger m-2"
                onClick={props.deleteTicket}
              >
                Delete
              </button>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};

export default TicketContent;
