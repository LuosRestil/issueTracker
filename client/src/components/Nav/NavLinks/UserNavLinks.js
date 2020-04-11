import React from "react";
import { Link } from "react-router-dom";

const UserNavLinks = (props) => {
  return (
    <div
      className="collapse navbar-collapse flex-grow-0"
      id="navbarSupportedContent"
    >
      <ul className="navbar-nav">
        <li>
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>

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
    </div>
  );
};

export default UserNavLinks;
