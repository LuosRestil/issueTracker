import React from "react";
import { Link } from "react-router-dom";

const AdminNavLinks = (props) => {
  return (
    <ul className="navbar-nav ml-auto">
      <li>
        <Link className="nav-link" to="/">
          Home
        </Link>
        <Link className="nav-link" to="/userSearch">
          User Search
        </Link>
      </li>
      <li className="nav-item dropdown">
        <button
          className="dropdown-toggle btn btn-link"
          id="navbarDropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Departments
        </button>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link className="dropdown-item" to="/tickets/all">
            All
          </Link>
          <div className="dropdown-divider"></div>
          <Link className="dropdown-item" to="/tickets/hardware">
            Hardware
          </Link>
          <Link className="dropdown-item" to="/tickets/software">
            Software
          </Link>
          <Link className="dropdown-item" to="/tickets/janitorial">
            Janitorial
          </Link>
          <Link className="dropdown-item" to="/tickets/other">
            Other
          </Link>
        </div>
      </li>
      <li className="nav-item">
        <button className="btn btn-link" onClick={props.logout}>
          Log Out
        </button>
      </li>
    </ul>
  );
};

export default AdminNavLinks;
