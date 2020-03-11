import React from "react";
import { Link } from "react-router-dom";

const UserNavLinks = props => {
  return (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/submitIssue">
          New Support Ticket
        </Link>
      </li>
      <li className="nav-item">
        <button className="btn btn-link" onClick={props.logout}>
          Log Out
        </button>
      </li>
    </ul>
  );
};

export default UserNavLinks;
