import React, { useState, useEffect } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  let [logged, setLogged] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("qrs")) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Nav logged={logged} setLogged={setLogged} />
        <Switch>
          {/* <ProtectedRoute path="/dashboard" exact component={Dashboard} /> */}
          <ProtectedRoute
            exact
            path="/dashboard"
            component={Dashboard}
            logged={logged}
            setLogged={setLogged}
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
              <Login {...props} logged={logged} setLogged={setLogged} />
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
