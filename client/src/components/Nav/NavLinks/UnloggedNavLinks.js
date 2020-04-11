import React from "react";
import { Link } from "react-router-dom";

const UnloggedNavLinks = () => {
  return (
    <div
      className="collapse navbar-collapse flex-grow-0 ml-auto"
      id="navbarSupportedContent"
    >
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UnloggedNavLinks;
