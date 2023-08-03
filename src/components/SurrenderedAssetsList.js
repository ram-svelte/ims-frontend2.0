import { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { BASE_URL } from "../Urls";
import { Toast } from "../Utils/Toastify";
import axios from "axios";
import "../css/MyAssets.css";
import { CPU, MONITOR } from "../Constant";

const SurrenderedAssetsList = (props) => {
  const [empId, setEmpId] = useState(props.authorizedEmpId);
  const [disabled, setDisabled] = useState(true);
  const buttonRef = useRef(null);
  const access_token = sessionStorage.getItem("jwtToken");

  // console.log("props in List Asset are", props);
  const regExp = new RegExp(`^[0-9]{4}[a-zA-Z]{1}$`);

  let isDesktop = false;
  if (props.title === CPU || props.title === MONITOR) {
    isDesktop = true;
  }

  const enableEmployeeInput = () => {
    if (disabled) {
      setDisabled(!disabled);
      buttonRef.current.focus();
      console.log("button ref is ", buttonRef);
    }
  };
  const handleEmployeeInput = (e) => {
    setEmpId(e.target.value);
  };

  const handleChange = (e) => {
    props.onCheckBoxHandler(e);
  };

  const submitHandler = async () => {
    const transformAssetsItem = {
      employeeId: empId,
      serialNo: props.sno,
      prod_id: props.prod_id,
    };
    console.log("allocation Id is ", props.allocationId);
    console.log("transformAssetsItem", transformAssetsItem);
    if (!transformAssetsItem.employeeId.match(regExp)) {
      Toast("Invalid Employee Id", "error");
      return;
    }
    //return;
    try {
      const res = await axios.request({
        method: "POST",
        url: `${BASE_URL}/api/employee/employeeDetails/${props.allocationId}`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: transformAssetsItem,
      });

      if (res.status === 200) {
        Toast("Assets Updated Successfully", "success");
        window.location.reload(false);
      }
    } catch (err) {}
  };
  //console.log("props . toggle", props.toggle);
  return (
    <>
      <tr>
        <td>
          <input
            type="checkbox"
            className="form-check-input"
            onChange={handleChange}
            name={props.sno}
            checked={props.checked}
            disabled={props.toggle && props.surrenderToggle}
            // onChange={handleChange}
          />
        </td>
        <td>{props.index}</td>
        <td>{props.title}</td>
        <td>{props.brand}</td>
        <td>{props.model}</td>
        {isDesktop ? <td>{props.orderType}</td> : <td>Others</td>}
        <td>{props.sno}</td>
        <td>{props.dop}</td>
        {/* <td>
          <TextareaAutosize
            cacheMeasurements
            placeholder="Employee Id"
            ref={buttonRef}
            value={empId}
            disabled={disabled}
            onChange={"handleEmployeeInput"}
          />
        </td> */}
        {/* {!props.handover && !props.takeover ? (
          <>
            <td className="allocation_edit_container">
              <button
                className="btn btn-primary inc-dec"
                onClick={enableEmployeeInput}
                //   //type="Submit"
              >
                Edit
              </button>
            </td>
            <td className="allocation_submit_container">
              <button
                className="btn btn-primary inc-dec"
                onClick={submitHandler}
                //type="Submit"
              >
                Submit
              </button>
            </td>
          </>
        ) : null} */}
      </tr>
    </>
  );
};

export default SurrenderedAssetsList;
