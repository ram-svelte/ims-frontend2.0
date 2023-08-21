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
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { currentPath } from "../redux/action";
import { useDispatch } from "react-redux";
import SideBar from "../UI/sideBar";

const TakingOverAssets = () => {
  const { isLoading, error, sendRequest: fetchAssets } = useHttp();
  const [items, setItems] = useState([]);
  const access_token = localStorage.getItem("jwtToken");
  const [checkedData, setCheckedData] = useState([]);
  //const [toggle, setToggle] = useState(false);
  const [userInput, setUserInput] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  let decoded = jwt_decode(access_token);
  const USERID = decoded.id;

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

  const submitCheckedBoxData = async (req) => {
    const filteredData = items?.filter((item) => item.isChecked === true);
    console.log("filteredData", filteredData);
    const handOverAssets = [];
    filteredData.forEach((item, i) => {
      handOverAssets.push({
        ...item,
      });
    });
    console.log("handoverAssets", handOverAssets);

    const key = "allocationId";

    const uniqueAllocationId = [
      ...new Map(handOverAssets?.map((item) => [item[key], item])).values(),
    ];

    console.log("arrayUniqueByKey", uniqueAllocationId);

    const sendAssetObject = [];
    uniqueAllocationId?.forEach((allocationItem) => {
      sendAssetObject.push({
        _id: allocationItem.allocationId,
        data: handOverAssets.filter(
          (item) => item.allocationId === allocationItem.allocationId
        ),
      });
    });

    console.log("sendAssetObject", sendAssetObject);
    if (!sendAssetObject.length) {
      Toast("Please select the Asset", "error");
      return;
    }

    //return;

    try {
      const res = await axios.request({
        method: "POST",
        url: `${BASE_URL}/api/employee/handOver/${req}`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: sendAssetObject,
      });

      if (res.status === 200) {
        Toast("Assets Updated Successfully", "success");
        history.push("/myassets");
      }
    } catch (err) {}
  };

  //   const handleHandover = () => {
  //     setToggle(!toggle);
  //   };
  let loadedItems = [];
  useEffect(() => {
    const transformAssetsItem = (assetsItems) => {
      //console.log("assetsItems are", assetsItems);
      assetsItems = assetsItems?.data;
      console.log("order items bfr push", assetsItems);

      assetsItems?.forEach((data, i) => {
        console.log(data,"ljfbhfbh")
        let empId = data?.empId;
        let allocationId = data?._id;
        data?.authorizedToUse?.forEach((item, i) => {
          console.log(item?.user_id, USERID,item?.status,"kbjhfhbf")
          if (item?.status === "TakingOverReq" && item?.user_id == USERID) {
            loadedItems?.push({
              employeeId: empId,
              allocationId: allocationId,
              prod_id: item?.prod_id?._id,
              title: item?.prod_id?.title,
              brand: item?.brand,
              model: item?.model,
              fromUser: item?.fromUser,
              toUser: item?.toUser,
              user_id: item?.user_id,
              serialNo: item?.serialNo,
              dop: item?.dop?.split("T")[0],
              authorizedEmpId: item?.employeeId,
              _id: item?._id,
            });
            setItems(loadedItems);
          }
          console.log(items,"ljdbkhbf")
        });
      });

      console.log("loadedItems  are", loadedItems);
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
      handover={true}
      takeover={false}
    />
  ));
  return (
    <>
      <NavigationBar />
      <div style={{display:"flex"}}>  <SideBar/> 
      <div>
      <Container>
        <div className="container-fluid">
          <div
            className="cat-head text-center"
            style={{ marginBottom: "2rem" }}
          >
            Taking Over Request
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
                    style={{ marginRight: "0.5rem" }}
                    onClick={() => submitCheckedBoxData("approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    className="handover_rejected_buttom"
                    onClick={() => submitCheckedBoxData("cancel")}
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
                      <th>Modal</th>
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
      </div></div>
    </>
  );
};

export default TakingOverAssets;
