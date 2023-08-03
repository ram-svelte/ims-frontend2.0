import { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
const ListAsset = (props) => {
  const [empId, setEmpId] = useState(props.authorizedEmpId);
  const [disabled, setDisabled] = useState(true);
  const buttonRef = useRef(null);

  console.log("props in List Asset are", props);

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
  return (
    <>
      <tr>
        <td>{props.index}</td>
        <td>{props.title}</td>
        <td>{props.brand}</td>
        <td>{props.model}</td>
        <td>{props.sno}</td>
        <td>{props.dop}</td>
        {/* <td>{props.name}</td> */}
        {/* <td>{props.empId}</td> */}
        {/* <td>{props.designation}</td>
  <td>{props.branch}</td> */}
        <td>
          <TextareaAutosize
            cacheMeasurements
            placeholder="Employee Id"
            ref={buttonRef}
            value={empId}
            disabled={disabled}
            onChange={handleEmployeeInput}
          />
        </td>
        <td>
          <button
            className="btn btn-primary inc-dec"
            onClick={enableEmployeeInput}
            //   //type="Submit"
          >
            Edit
          </button>
        </td>
        <td>
          <button
            className="btn btn-primary inc-dec"
            // onClick={() => stockUpdate(0, "")}
            //type="Submit"
          >
            Submit
          </button>
        </td>
      </tr>
    </>
  );
};

export default ListAsset;
