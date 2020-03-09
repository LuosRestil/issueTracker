import React from "react";
import { Link, Redirect } from "react-router-dom";

const Nav = props => {
  const logout = () => {
    fetch("/api/logout").then(() => {
      window.localStorage.removeItem("qrs");
      props.setLogged(false);
      return <Redirect to="/login" />;
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        React Issue Tracker
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {props.logged ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mr-4">
              <a className="nav-link" href="/dashboard">
                Dashboard
              </a>
            </li>
            <li className="nav-item mr-4">
              <button className="btn btn-secondary" onClick={logout}>
                Log Out
              </button>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mr-4">
              <a className="btn btn-info" href="/register">
                Register
              </a>
            </li>
            <li className="nav-item mr-4">
              <a className="btn btn-info" href="/login">
                Log In
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Nav;
