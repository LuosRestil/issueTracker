import React, { useState, useEffect } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav/Nav";
import SubmitIssue from "./components/SubmitIssue";
import AllTickets from "./components/AllTickets";
import DeptTickets from "./components/DeptTickets";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  let [logged, setLogged] = useState(true);
  let [user, setUser] = useState({});
  let [support, setSupport] = useState([]);

  useEffect(() => {
    getUser();
    getSupport();
    if (!window.localStorage.getItem("qrs")) {
      setLogged(false);
    }
  }, [logged]);

  const getUser = () => {
    fetch("/api/getUser")
      .then(response => response.json())
      .then(json => {
        setUser(json);
      });
  };

  const getSupport = () => {
    fetch("/api/getSupport")
      .then(response => response.json())
      .then(json => {
        setSupport(json.support);
      });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Nav logged={logged} setLogged={setLogged} user={user} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Dashboard}
            logged={logged}
            setLogged={setLogged}
            user={user}
            support={support}
          />
          <ProtectedRoute
            exact
            path="/submitIssue"
            component={SubmitIssue}
            logged={logged}
            setLogged={setLogged}
            user={user}
            support={support}
          />
          <Route
            path="/register"
            exact
            render={props => <Register {...props} logged={logged} />}
          />
          <Route
            path="/login"
            exact
            render={props => (
              <Login
                {...props}
                logged={logged}
                setLogged={setLogged}
                setUser={setUser}
              />
            )}
          />
          <ProtectedRoute
            exact
            path="/tickets/all"
            component={AllTickets}
            logged={logged}
            setLogged={setLogged}
            user={user}
            support={support}
          />
          <ProtectedRoute
            path="/tickets/:department"
            component={DeptTickets}
            logged={logged}
            setLogged={setLogged}
            user={user}
            support={support}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
