import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  logged,
  setLogged,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!logged) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { flashInfo: "Please log in to continue." }
              }}
            />
          );
        } else {
          return <Component {...props} logged={logged} setLogged={setLogged} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
