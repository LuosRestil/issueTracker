import React from "react";
import { Link } from "react-router-dom";
import UnloggedNavLinks from "./NavLinks/UnloggedNavLinks";
import AdminNavLinks from "./NavLinks/AdminNavLinks";
import SupportNavLinks from "./NavLinks/SupportNavLinks";
import UserNavLinks from "./NavLinks/UserNavLinks";

const Nav = (props) => {
  const logout = () => {
    fetch("/api/logout").then(() => {
      window.localStorage.removeItem("qrs");
      props.setLogged(false);
    });
  };

  return (
    <nav className="navbar navbar-expand-xs navbar-dark bg-nav">
      <Link to="/" className="navbar-brand">
        Help Desk
      </Link>
      {props.logged ? (
        <p className="username ml-auto pr-3">Welcome, {props.user.username}!</p>
      ) : null}

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
        {!props.logged ? (
          <UnloggedNavLinks />
        ) : props.user.role === "user" ? (
          <UserNavLinks logout={logout} />
        ) : props.user.role === "support" ? (
          <SupportNavLinks logout={logout} />
        ) : props.user.role === "admin" ? (
          <AdminNavLinks logout={logout} />
        ) : (
          "no user role"
        )}
      </div>
    </nav>
  );
};

export default Nav;
