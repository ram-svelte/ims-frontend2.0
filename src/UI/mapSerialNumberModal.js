import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/mapSerialNumberModal.css";

function MapSerialNumber(props) {
  const [formFields, setFormFields] = useState([]);
  // if (props.finalOrder[0]) {
  //   const userId = props.finalOrder[0].userId;
  //   props.finalOrder[0]?.employeeId.push(userId);
  // }

  const mapProduct = (e) => {
    e.preventDefault();
    console.log(formFields);
    props.mapProducts(1, formFields);
  };

  console.log("form fields are", formFields);

  console.log("props are ", props);
  console.log(
    "props.finalOrder in modal is ",
    props.finalOrder[0]?.productsDetails
  );

  useEffect(() => {
    console.log("in use Effect");
    if (props.finalOrder[0]?.productsDetails) {
      const data = props.finalOrder[0].productsDetails.map((item) => ({
        serialNo: item.sno,
        prodId: item.prodId,
        employeeId: props.finalOrder[0].Empid,
      }));
      console.log("data is ", data);
      setFormFields(data);
    }
    if (props.finalOrder[0]) {
      const Empid = props.finalOrder[0].Empid;
      props.finalOrder[0]?.employeeId.unshift(Empid);
    }

    return () => props.finalOrder[0]?.employeeId.shift();
  }, [props.finalOrder]);

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    console.log("form fields are ...... ", data);
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  return (
    <>
      <Modal size="lg" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ fontSize: "20px", color: "#fc0303", marginRight: "2px" }}
            />
          </Modal.Title>
          <Modal.Title>Assign the serial numbers to the employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="mapping_serialno_form" onSubmit={mapProduct}>
            {formFields.map((form, index) => {
              return (
                <div className="map_serial_no" key={index}>
                  <label htmlFor="serialno" className="serial_no">
                    S.No. For:
                  </label>
                  <input
                    className="serial_no_input"
                    name="serialNo"
                    placeholder="Serial No"
                    // onChange={(event) => handleFormChange(event, index)}
                    value={form.serialNo}
                  />
                  <label className="employee_id" htmlFor="employeeId">
                    Employee ID:
                  </label>
                  <select
                    name="employeeId"
                    className="employee_id_input"
                    onChange={(event) => handleFormChange(event, index)}
                  >
                    {/* <option value="">
                      {/* {
                        props.finalOrder[0]?.employeeId[
                          props.finalOrder[0].employeeId.length - 1
                        ]
                      } */}
                    {/* {props.finalOrder[0]?.userId} */}
                    {/* </option> */} */
                    {props.finalOrder[0].employeeId
                      ? props.finalOrder[0].employeeId.map((item) => (
                          <option value={item}>{item}</option>
                        ))
                      : null}
                  </select>
                </div>
              );
            })}
          </form>
          {/* <button onClick={submit}>Submit</button> */}
        </Modal.Body>
        <Modal.Footer>
          <Button className="yes_button" variant="primary" onClick={mapProduct}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MapSerialNumber;
