import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

function Dashboard(props) {
  console.log(props);

  let [user, updateUser] = useState({});
  let [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    getLoggedOut();
    getUser();
  }, []);

  let flashSuccess;
  try {
    flashSuccess = props.location.state.flashSuccess;
  } catch {}

  const getUser = () => {
    fetch("/api/getUserInfo")
      .then(res => res.json())
      .then(json => {
        updateUser(json);
      });
  };

  const getLoggedOut = () => {
    if (!window.localStorage.getItem("qrs")) {
      setLoggedOut(true);
    } else {
      setLoggedOut(false);
    }
  };

  if (loggedOut) {
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
      <div className="App">
        {flashSuccess ? (
          <div className="alert alert-success">{flashSuccess}</div>
        ) : null}
        <h1 className="mt-5">IT WORKS!!!</h1>
        <div className="container user-info">
          <h3>Welcome {user.username}!</h3>
          <p>Your user id is {user._id}</p>
        </div>
      </div>
    );
  }
}

export default Dashboard;
