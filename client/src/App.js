import React, { useState, useEffect } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav/Nav";
import SubmitIssue from "./components/SubmitIssue";
import AllTickets from "./components/AllTickets";
import DeptTickets from "./components/DeptTickets";
import UserSearch from "./components/UserSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  let [logged, setLogged] = useState(true);
  let [user, setUser] = useState({});
  let [support, setSupport] = useState([]);

  useEffect(() => {
    getUser();
    getSupport();
  }, []);

  const getUser = () => {
    fetch("/api/getUser")
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          setLogged(false);
        } else {
          setUser(json);
        }
      });
  };

  const getSupport = () => {
    fetch("/api/getSupport")
      .then((response) => response.json())
      .then((json) => {
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
            render={(props) => <Register {...props} logged={logged} />}
          />
          <Route
            path="/login"
            exact
            render={(props) => (
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
          <ProtectedRoute
            path="/userSearch"
            component={UserSearch}
            logged={logged}
            setLogged={setLogged}
            user={user}
            support={support}
          />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
