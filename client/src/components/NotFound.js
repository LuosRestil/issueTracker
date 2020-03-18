import React from "react";

const NoMatch = ({ location }) => (
  <div>
    <h3 className="mt-5">
      404, <code>{location.pathname}</code> not found.
    </h3>
  </div>
);

export default NoMatch;
