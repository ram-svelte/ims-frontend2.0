import NavigationBar from "../UI/NavigationBar";
import { useState, useEffect } from "react";
import { Container, Button, Table } from "react-bootstrap";
import MyAssetList from "../components/MyAssetList";
import useHttp from "../hooks/use-http";
import { BASE_URL } from "../Urls";
import { Toast } from "../Utils/Toastify";
import LoadingSpinner from "../UI/LoadingSpinner";
import axios from "axios";
import "../css/MyAssets.css";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { currentPath } from "../redux/action";
import { useDispatch } from "react-redux";

const MyAssets = () => {
  const { isLoading, error, sendRequest: fetchAssets } = useHttp();
  const [items, setItems] = useState([]);
  const access_token = sessionStorage.getItem("jwtToken");
  const [checkedData, setCheckedData] = useState([]);
  const [surrenderToggle, setSurrenderToggle] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [userInput, setUserInput] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  let decoded = jwt_decode(access_token);
  const USERID = decoded.name;

  //storing currentUrl to sessionStorage
  const currentUrl = window.location.href;
  const splitUrl = currentUrl.split("/");
  if (currentUrl.includes("?")) {
    const newUrl = splitUrl[3].split("?");
    sessionStorage.setItem("currentUrl", newUrl[0]);
    dispatch(currentPath(newUrl[0]));
  } else {
    sessionStorage.setItem("currentUrl", splitUrl[3]);
    dispatch(currentPath(splitUrl[3]));
  }

  // let checkedAssets = [];

  //const checkedData = {};

  const checkBoxHandler = (e) => {
    // console.log("asset data is ", assetData);

    const { name, checked } = e.target;
    console.log(`${name} is ${checked}`);
    if (name === "allSelect") {
      const checkedAssets = items.map((item) => {
        return { ...item, isChecked: checked };
      });
      console.log("checked items are", checkedAssets);
      setItems(checkedAssets);
    } else {
      let checkedAssets = items.map((item) =>
        item.serialNo === name ? { ...item, isChecked: checked } : item
      );
      console.log("checked assets is ", checkedAssets);
      setItems(checkedAssets);
    }
  };

  const submitSurrender = async () => {
    const newData = items.filter((item) => item.isChecked === true);
    const dataId = newData.map((item) => item._id);
    console.log("dataId", dataId);
    if (newData.length <= 0) {
      Toast("Please Select the Asset to procede", "warning");
      // return;
    }
    // return;
    try {
      const res = await axios.request({
        method: "POST",
        url: `${BASE_URL}/api/employee/surrender`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: dataId,
      });

      if (res.status === 200) {
        Toast("Assets Updated Successfully", "success");
        history.push("/surrenderedassets");
      }
    } catch (err) {}
    console.log(newData, "This is the newData ");
  };

  const submitCheckedBoxData = async () => {
    const filteredData = items.filter((item) => item.isChecked === true);
    console.log("filteredData", filteredData);
    const handOverAssets = [];
    filteredData.forEach((item, i) => {
      handOverAssets.push({
        ...item,
        fromUser: USERID,
        toUser: userInput,
        user_id: USERID,
        handoverId: userInput,
      });
    });

    console.log("handoverAssets", handOverAssets);

    const key = "allocationId";

    const uniqueAllocationId = [
      ...new Map(handOverAssets.map((item) => [item[key], item])).values(),
    ];

    console.log("arrayUniqueByKey", uniqueAllocationId);

    const sendAssetObject = [];

    uniqueAllocationId.forEach((allocationItem) => {
      sendAssetObject.push({
        _id: allocationItem.allocationId,
        data: handOverAssets.filter(
          (item) => item.allocationId === allocationItem.allocationId
        ),
      });
    });

    console.log("sendAssetObject", sendAssetObject);
    // return;
    if (userInput) {
      if (!sendAssetObject.length) {
        Toast("Please select the Asset", "error");
        return;
      }
    } else {
      Toast("User Id cannot be empty", "error");
      return;
    }
    try {
      const res = await axios.request({
        method: "POST",
        url: `${BASE_URL}/api/employee/handOver/handover`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: sendAssetObject,
      });

      if (res.status === 200) {
        Toast("Assets Updated Successfully", "success");
        //window.location.reload(false);
        history.push("/handoverassets");
      }
    } catch (err) {}
  };

  const handleHandover = () => {
    setToggle(!toggle);
  };

  const onSurrenderHandler = () => {
    setSurrenderToggle(!surrenderToggle);
  };

  useEffect(() => {
    const transformAssetsItem = (assetsItems) => {
      //console.log("assetsItems are", assetsItems);
      assetsItems = assetsItems.data;
      console.log("order items bfr push", assetsItems);
      const loadedItems = [];

      assetsItems.forEach((data, i) => {
        let empId = data.empId;
        let allocationId = data._id;
        let orderType = data.orderType;
        data.authorizedToUse.forEach((item, i) => {
          if (item.status === "Owned" && item.user_id == USERID) {
            loadedItems.push({
              orderType: orderType,
              employeeId: empId,
              allocationId: allocationId,
              prod_id: item.prod_id._id,
              title: item.prod_id.title,
              brand: item.brand,
              model: item.model,
              serialNo: item.serialNo,
              dop: item.dop.split("T")[0],
              authorizedEmpId: item.employeeId,
              _id: item._id,
            });
          }
        });
      });

      console.log("loadedItems  are", loadedItems);
      setItems(loadedItems);
    };
    fetchAssets(
      {
        url: `${BASE_URL}/api/employee`,
        headers: { Authorization: `Bearer ${access_token}` },
      },
      transformAssetsItem
    );
  }, [fetchAssets]);

  const myAssetItems = items.map((item, i) => (
    <MyAssetList
      key={item.serialno}
      index={i + 1}
      orderType={item.orderType}
      allocationId={item.allocationId}
      prod_id={item.prod_id}
      empId={item.employeeId}
      title={item.title}
      brand={item.brand}
      sno={item.serialNo}
      model={item.model}
      dop={item.dop}
      surrenderToggle={!surrenderToggle}
      toggle={!toggle}
      authorizedEmpId={item.authorizedEmpId}
      checked={item?.isChecked || false}
      onCheckBoxHandler={checkBoxHandler}
      handover={false}
      takeover={false}
      surrender={false}
    />
  ));
  return (
    <>
      <NavigationBar />
      <Container>
        <div className="container-fluid">
          <div
            className="cat-head text-center"
            style={{ marginBottom: "2rem" }}
          >
            My Assets
          </div>
        </div>
        {isLoading ? (
          <>
            <div className=" d-flex justify-content-center loading_spinner ">
              <LoadingSpinner />
            </div>
          </>
        ) : (
          <>
            {items.length === 0 ? (
              <>
                <div className="container-fluid">
                  <div
                    className="cat-head text-center"
                    style={{ marginBottom: "2rem" }}
                  >
                    No Assets Found
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="handleover_container d-inline-block ">
                  <Button onClick={handleHandover} hidden={surrenderToggle}>
                    Handover
                  </Button>

                  {toggle ? (
                    <div className="d-inline-flex form-inline">
                      <label className="form-label">To:</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Please Enter User Id"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                      />
                      <Button onClick={submitCheckedBoxData}>Submit</Button>
                    </div>
                  ) : null}
                </div>
                <div className="surrender d-inline-block">
                  <Button onClick={onSurrenderHandler} hidden={toggle}>
                    Surrender Asset
                  </Button>

                  {surrenderToggle ? (
                    <>
                      <label>Select the asset and </label>

                      <Button onClick={submitSurrender}>
                        Confirm Surrender
                      </Button>
                    </>
                  ) : null}
                </div>

                <Table className="order table-bordered  table-responsive ledger_table">
                  <thead>
                    <tr>
                      <th colSpan={6}></th>
                      {/* <th colSpan={4}> Issued To</th> */}
                      <th colSpan={1}> Authorised To </th>
                      <th colSpan={4}></th>
                      {/* <th></th> */}
                    </tr>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="allSelect"
                          // checked={
                          //   users.filter((user) => user?.isChecked !== true).length < 1
                          // }
                          disabled={!toggle && !surrenderToggle}
                          checked={
                            !items.some((item) => item?.isChecked !== true)
                          }
                          onChange={checkBoxHandler}
                        />
                        <label className="form-check-label ms-2">
                          Select All
                        </label>
                      </th>
                      <th>Sr No.</th>
                      <th>Product Name</th>
                      <th> Brand </th>
                      <th>Model</th>
                      <th>Order Type</th>
                      <th>Serial No.</th>
                      <th>Year of Purchase</th>
                      <th>Employee Id</th>
                      <th>Edit</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{myAssetItems}</tbody>
                </Table>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default MyAssets;
