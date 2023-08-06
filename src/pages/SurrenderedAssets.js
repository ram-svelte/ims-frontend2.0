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
import { toast } from "react-toastify";
import SurrenderedAssetsList from "../components/SurrenderedAssetsList";
import { currentPath } from "../redux/action";
import { useDispatch } from "react-redux";

const SurrenderedAssets = () => {
  const { isLoading, error, sendRequest: fetchAssets } = useHttp();
  const [items, setItems] = useState([]);
  const access_token = localStorage.getItem("jwtToken");
  const [checkedData, setCheckedData] = useState([]);
  //const [toggle, setToggle] = useState(false);
  const [userInput, setUserInput] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  let decoded = jwt_decode(access_token);
  const USERID = decoded.name;

  //storing currentUrl to localStorage
  const currentUrl = window.location.href;
  const splitUrl = currentUrl.split("/");
  if (currentUrl.includes("?")) {
    const newUrl = splitUrl[3].split("?");
    localStorage.setItem("currentUrl", newUrl[0]);
    dispatch(currentPath(newUrl[0]));
  } else {
    localStorage.setItem("currentUrl", splitUrl[3]);
    dispatch(currentPath(splitUrl[3]));
  }

  // console.log("USERID is", USERID);

  //const checkedData = {};

  const checkBoxHandler = (e) => {
    // console.log("asset data is ", assetData);

    const { name, checked } = e.target;
    console.log(`${name} is ${checked}`);
    if (name === "allSelect") {
      let checkedAssets = items.map((item) => {
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

  const submitCheckedBoxData = async () => {
    const filteredData = items.filter((item) => item.isChecked === true);
    const newData = filteredData.map((item) => item._id);
    console.log("filteredData id", newData);

    console.log("filteredData", filteredData);

    if (!filteredData.length) {
      Toast("Please select the Asset", "error");
      return;
    }
    //return;
    try {
      const res = await axios.request({
        method: "POST",
        url: `${BASE_URL}/api/employee/surrender/cancel`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: newData,
      });

      if (res.status === 200) {
        Toast("Assets Updated Successfully", "success");
        //window.location.reload(false);
        history.push("/myassets");
      }
    } catch (err) {}
  };

  //   const handleHandover = () => {
  //     setToggle(!toggle);
  //   };

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
          if (item.transferStatus === "surrender pending") {
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
              transferStatus: item.transferStatus,
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
      transferStatus={item.transferStatus}
      orderType={item.orderType}
      index={i + 1}
      allocationId={item.allocationId}
      prod_id={item.prod_id}
      empId={item.employeeId}
      title={item.title}
      brand={item.brand}
      sno={item.serialNo}
      model={item.model}
      dop={item.dop}
      toggle={false}
      authorizedEmpId={item.authorizedEmpId}
      checked={item?.isChecked || false}
      onCheckBoxHandler={checkBoxHandler}
      surrender={true}
      // takeover={false}
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
            Surrendered Assets{" "}
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
                    No Request Found
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="handleover_container">
                  <Button
                    className="handover_rejected_buttom"
                    onClick={submitCheckedBoxData}
                  >
                    Cancel
                  </Button>
                </div>

                <Table className="order table-bordered  table-responsive ledger_table">
                  <thead>
                    <tr>
                      <th colSpan={6}></th>
                      {/* <th colSpan={4}> Issued To</th> */}
                      <th colSpan={1}> Authorised To </th>
                      <th colSpan={3}></th>
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
                          //   disabled={!toggle}
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

export default SurrenderedAssets;
