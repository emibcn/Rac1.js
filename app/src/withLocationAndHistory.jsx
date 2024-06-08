import React from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";

const withLocationAndHistory = (Component) => (props) => {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();

  return <Component {...{ history, location, match: { params }, ...props }} />;
};

export default withLocationAndHistory;
