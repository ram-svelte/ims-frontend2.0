import React from "react";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useHistory } from "react-router-dom";
import "../css/BackLoginForm.css";

function BackLoginForm(props) {
  const history = useHistory();
  const formSubmitHandler = (e) => {
    e.preventDefault();
  };
  const clickHandler = () => {
    // history.push("/categories");
    props.onLogin();
    history.push("/");
  };

  return (
    <>
      <form className="backLoginForm" onSubmit={formSubmitHandler}>
        <button type="submit" className=" mailbox">
          MAILBOX
        </button>
        <button onClick={clickHandler} className="inventory">
          INVENTORY
        </button>
      </form>
      <div className="d-flex justify-content-center">
        <FontAwesomeIcon 
          className="back-arrow"
          onClick={() => props.onFlip()}
          icon={faChevronCircleLeft}
          style={{ fontSize: "20px", color: "#337ED7", marginTop: "4px" }}
        />
      </div>
    </>
  );
}

export default BackLoginForm;
