import React from "react";
import { Modal, Button } from "react-bootstrap";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/Cartmodal.css";

function CartIfDesktop(props) {
  //   const addProductInModal = () => {
  //     props.addProduct(1);
  //   };
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ fontSize: "20px", color: "#fc0303", marginRight: "2px" }}
            />
          </Modal.Title>
          <Modal.Title>WARNING</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            You cannot add CPU, Monitor and Desktop in a single order. 
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          {/* <Button
            className="yes_button"
            variant="primary"
            onClick={addProductInModal}
          >
            YES
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CartIfDesktop;
