import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from "react-textarea-autosize";
import { fetchAllBranch } from "../redux/action/index";
import {
  COMPUTERS,
  ELECTRICALS,
  FURNITURE,
  MISCAP,
  OTHERCOMP,
} from "../Constant";
import { Toast } from "../Utils/Toastify";
import "../css/IntercomModal.css";

function IntercomModal(props) {
  const [intercomNumber, setIntercomNumber] = useState();
  const [remarks, setremarks] = useState("");
  const [radioValue, setRadioValue] = useState(false);
  const [indentedFor, setIndentedFor] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [checkboxData, setCheckboxData] = useState("");
  const [irla, setIrla] = useState();
  const [branchOf, setBranchOf] = useState();
  const [designation, setDesignation] = useState();
  const [Empid, setEmpid] = useState();
  const [newEmp, setNewEmp] = useState({ empIdArray: "" });
  const [mystate, setMystate] = useState([]);
  const [input, setInput] = useState();
  const regExp = new RegExp(`^[0-9]{4}[a-zA-Z]{1}$`);

  // const [newEmpIdArray,setNewEmpIdArray]=useState([])
  const allBranches = useSelector((state) => state.handleAllBranch.branch);
  const cart = useSelector((state) => state.handleCart.cart);
  const dispatch = useDispatch();
  console.log("allBranch is ", allBranches);
  console.log("branchOf", branchOf);
  // console.log("branch", allBranches[0].allBranch);
  //let cartItemArray = localStorage.getItem("cartItemArray");
  //cartItemArray = JSON.parse(cartItemArray);
  // console.log("cartItemArray", cartItemArray[0].qty);
  let empId = [];
  // let empIdArray = [...mystate];
  let newEmpIdArray = [];
  // console.log("empIdArray", empIdArray);
  let flag = false;
  let serial_item = false;
  var arr = [];
  let tempData = [];
  if (
    props.cartTitle === COMPUTERS ||
    props.cartTitle === ELECTRICALS ||
    props.cartTitle === FURNITURE ||
    props.cartTitle === OTHERCOMP ||
    props.cartTitle === MISCAP
  ) {
    flag = true;
  } else {
    flag = false;
  }

  if (
    props.cartTitle === COMPUTERS ||
    props.cartTitle === ELECTRICALS ||
    props.cartTitle === OTHERCOMP
  ) {
    serial_item = true;
  } else {
    serial_item = false;
  }

  const getIndentedData = (e) => {
    setIndentedFor(e.target.value);
  };
  const getCheckboxData = (e) => {
    console.log("e.target.value", e.target.value);
    setCheckboxData(e.target.value);
  };

  const handleIntercom = (e) => {
    setIntercomNumber(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchAllBranch());
  }, [dispatch]);

  const addOrderInModal = () => {
    console.log("indentedFor-----", indentedFor);

    // if (!Empid.match(regExp)) {
    //   Toast("Invalid Employee Id", "error");
    //   return;
    // }

    setCheckbox(!checkbox);
    setCheckboxData("");
    setIntercomNumber("");
    setremarks("");
    setRadioValue(false);

    for (const key in mystate) {
      if (mystate[key]) {
        tempData.push(mystate[key]);
      }
      console.log(tempData, "tempdata");
    }

    props.addProduct(
      intercomNumber,
      1,
      remarks,
      indentedFor,
      checkboxData,
      irla,
      branchOf,
      designation,
      Empid,
      tempData
    );

    console.log("intercomNumber----", intercomNumber);
    console.log("checkboxData==", checkboxData);
  };
  const handleBranch = (value) => {
    props.setRadioSelect(value);

    setRadioValue(true);
  };

  let cartItems = [];
  let totalCartItems = 0;

  if (cart) {
    cartItems = cart.map((item) => item.qty);
    totalCartItems = cartItems.reduce((sum, a) => sum + a, 0);
  }

  const handleAllBranch = (e, index) => {
    const { value } = e.target;
    setMystate((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  if (totalCartItems) {
    for (let i = 0; i < totalCartItems; i++) {
      empId.push(
        <div
          className="col-sm-5.1 d-inline-block mb-1"
          style={{ marginRight: "25px" }}
        >
          {console.log(mystate, "array")}
          <input
            id={i}
            type="text"
            className="form-control"
            // value={empIdArray[i]}
            value={newEmp.empIdArray[i]}
            name={`serialno${i}`}
            placeholder="Enter Employee Id"
            onChange={(e) => handleAllBranch(e, i)}
          />
        </div>
      );
    }
  }

  console.log("totalCartItems", totalCartItems);

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
          <Modal.Title>Enter required information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-group row mb_10">
            <div className="col-sm-12">
              <label className="form-label intercom_heading">
                Enter Intercom No. and Room No. :
              </label>

              <div className="intercom_text">
                <input
                  type="text"
                  onChange={handleIntercom}
                  value={intercomNumber}
                  placeholder="Enter Intercom No. and Room No."
                  className="form-control"
                ></input>
              </div>
            </div>
            <div className="col-sm-12">
              {/* <div className="col-sm-5 d-inline-block" style={{ marginRight: "22px" }}>
                <label
                  for="category-select"
                  className="form-label requirement_heading"
                >
                  Branch:
                </label>
                <input
                  type="text"
                  placeholder="Please enter Branch"
                  className="form-control"
                  onChange={(e) => setBranchOf(e.target.value)}
                />
              </div> */}

              {/* <div
                className="col-sm-5 d-inline-block"
                style={{ marginRight: "22px" }}
              >
                <label
                  for="category-select"
                  className="form-label requirement_heading"
                >
                  Branch:
                </label>
                <select
                  name="category"
                  id="category-select"
                  aria-label="Default select example"
                  className="form-select"
                  onChange={(e) => setBranchOf(e.target.value)}
                >
                  <option value="">Select a Branch</option>
                  {allBranches.length > 0
                    ? allBranches[0].allBranch.map((item) => (
                        <option>{item.branch}</option>
                      ))
                    : "Error"}
                </select>
              </div> */}
              {/* <div className="col-sm-6 d-inline-block">
                <label
                  for="category-select"
                  className="form-label requirement_heading"
                >
                  Designation:
                </label>
                <input
                  type="text"
                  placeholder="Please enter Designation"
                  className="form-control"
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div> */}
            </div>
          </form>
          {flag ? (
            <>
              <label className="form-label requirement_heading">
                Enter other fields as per prescribed Indent format e.g.:
                <br />
                Qty. already held,Item required is new or replacement
                <br />
                (If replacement, date of issue and justification),
                <br />
                Purpose of requirement, Are you new appointee or existing,
                <br />
                If transfer from other unit within Hqrs. premises -
                <br />
                (whether it is handed over to new incumbent or Admin)
              </label>
              <div className="requirement_text_area">
                <TextareaAutosize
                  cacheMeasurements
                  minRows={5}
                  maxRows={8}
                  className="form-control"
                  placeholder="Enter all fields as per prescribed indent format"
                  value={remarks}
                  onChange={(e) => setremarks(e.target.value)}
                />
              </div>

              <div>
                <div>
                  <div
                    className="col-sm-5 d-inline-block"
                    style={{ marginRight: "22px" }}
                  >
                    <label
                      for="category-select"
                      className="form-label requirement_heading"
                    >
                      Employee Id:
                    </label>
                    <input
                      type="text"
                      placeholder="6 digit without(-)"
                      className="form-control"
                      onChange={(e) => setEmpid(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-6 d-inline-block">
                    <label className="form-label requirement_heading">
                      IRLA No :
                    </label>
                    <input
                      type="text"
                      placeholder="Please enter IRLA No."
                      className="form-control"
                      value={irla}
                      onChange={(e) => setIrla(e.target.value)}
                    />
                  </div>
                  {serial_item ? (
                    <div className="requirement_heading">
                      <label
                        for="category-select"
                        className="form-label requirement_heading d-inline-table"
                      >
                        Allocated to:
                      </label>
                      {totalCartItems}
                      <br />
                      {empId.map((emp) => emp)}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className=" form-label requirement_heading d-inline-table">
                    Approval of JS taken
                    <input
                      className="form-check-input"
                      style={{ marginLeft: "5px" }}
                      type="checkbox"
                      onClick={() => setCheckbox(!checkbox)}
                    ></input>
                  </label>
                </div>
                <div>
                  {checkbox ? (
                    <div>
                      <label className="form-label requirement_heading">
                        File No. and date
                      </label>
                      <TextareaAutosize
                        className="form-control"
                        type="text"
                        id="textBox"
                        value={checkboxData}
                        onChange={getCheckboxData}
                        placeholder="File No. and date"
                      ></TextareaAutosize>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <div style={{ display: "block", marginBottom: "20px" }}>
            <Form>
              <>
                <p className="requirement_heading">Item indented for :</p>
                {["radio"].map((type) => (
                  <div key={`inline-${type}`} className="requirement_heading">
                    <Form.Check
                      inline
                      label="Self"
                      name="group1"
                      type={type}
                      id="Self"
                      onClick={() => setIndentedFor(true)}
                      onChange={(e) => {
                        setRadioValue(false);
                        props.setRadioSelect(e.target.id);
                      }}
                    />
                    <Form.Check
                      inline
                      label="Branch"
                      name="group1"
                      type={type}
                      id="Branch"
                      onClick={() => setIndentedFor(false)}
                      onChange={(e) => {
                        handleBranch(e.target.id);
                      }}
                    />
                    <div>
                      {radioValue ? (
                        <div>
                          <label className="form-label requirement_heading">
                            Strength with Designation :
                          </label>
                          <TextareaAutosize
                            className="form-control d-inline-block"
                            type="text"
                            onChange={getIndentedData}
                            placeholder="Enter Strength"
                          ></TextareaAutosize>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </>
            </Form>
          </div>

          <Button
            style={{ marginLeft: "37%", marginTop: "45px" }}
            className="yes_button"
            variant="primary"
            disabled={
              !intercomNumber || !indentedFor || (flag && !irla && !Empid)
            }
            onClick={() => {
              addOrderInModal();
            }}
          >
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default IntercomModal;
