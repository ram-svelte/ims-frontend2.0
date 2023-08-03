import React from "react";
import "../css/StatusText.css";

function StatusText(props) {
  if (props.status === "Partially Approved") {
    return <div className="status_Approved ">{props.status}</div>;
  } else {
    return <div className={`status_${props.status}`}>{props.status}</div>;
  }
}

export default StatusText;
