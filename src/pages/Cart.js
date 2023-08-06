import React, { useEffect, useState } from "react";
import NavigationBar from "../UI/NavigationBar";
import { useSelector } from "react-redux";
import CartList from "../components/CartList";
import axios from "axios";
import { currentPath, fetchUsersCart } from "../redux/action";
import { useDispatch } from "react-redux";
import "../css/cart.css";
import { BASE_URL } from "../Urls";
import { useHistory } from "react-router-dom";
import { Toast } from "../Utils/Toastify";
import { fetchAllCompProds } from "../redux/action";

import IntercomModal from "../UI/IntercomModal";
import { CPU, DESKTOP, MONITOR, TYPE } from "../Constant";
import SideBar from "../UI/sideBar";

function Cart() {
  const history = useHistory();
  const BRANCH = localStorage.getItem("userBranch");
  const DESIGNATION = localStorage.getItem("userDesignation");
  const NAME = localStorage.getItem("loggedUserName");
  const [show, setShow] = useState(false);
  const [radioSelect, setRadioSelect] = useState("");
  const dispatch = useDispatch();

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

  const cart = useSelector((state) => state.handleCart.cart);
  const allCompProds = useSelector(
    (state) => state.handleAllCompProds.compProd
  );

  console.log("allCompProds in cart.js", allCompProds);

  console.log("cart in cart.js", cart);
  let cart_title = "";
  try {
    cart_title = cart[0].catTitle;
  } catch (error) {
    cart_title = "";
  }
  console.log("cart title is ", cart_title);

  let flag = false;
  const cartLength = cart.length;

  useEffect(() => {
    dispatch(fetchAllCompProds());
  }, []);

  const access_token = localStorage.getItem("jwtToken");
  let showBtn = false;
  if (cartLength >= 1) {
    showBtn = true;
  } else {
    showBtn = false;
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const CartItems = () => {
    return cart.map((cartItem) => (
      <CartList
        item={cartItem}
        key={cartItem.id}
        title={cartItem.title}
        qty={cartItem.qty}
        imageSrc={cartItem.imageSrc}
      ></CartList>
    ));
  };

  const prodItems = allCompProds.map((item) => item);
  console.log("prodItems", prodItems);

  // const desktopItems = prodItems.filter(item=>item.title==="Monitor"||item.title==="CPU")
  // console.log("desktopItems",desktopItems);

  // for (const key in desktopItems)
  // prodItems.forEach((obj) => {
  //   if (obj.title === "Monitor") {
  //     monitorProdId = obj._id;
  //   }
  //   if (obj.title === "CPU") {
  //     cpuProdId = obj._id;
  //   }
  // });

  // const desktopItemsId = desktopItems.map(item=>item._id);
  // console.log("desktopItemsId",desktopItemsId)

  const addOrder = async (
    intercomNumber,
    x,
    justification,
    indentedFor,
    checkboxData,
    irla,
    branchOf = "",
    designation = "",
    Empid,
    tempData
  ) => {
    if (x === 1) {
      handleClose();
    } else {
      handleShow();
      return;
    }
    if (indentedFor === true) {
      indentedFor = "Self";
    }
    console.log("Indented For----", indentedFor);
    console.log("justification", justification);
    console.log("checkboxData---", checkboxData);
    const loadeditems = [];
    const desktopIndex = cart.findIndex((x) => x.prodType === TYPE);

    console.log("desktopIndex", desktopIndex);

    let quantity = "";

    // if (cart[desktopIndex].prodType === DESKTOP) {

    cart.forEach((item) => {
      if (item.qty <= 0 || item.qty == "") {
        flag = true;
      }
      if (item.prodType === TYPE) {
        quantity = item.qty;
        loadeditems.push({
          quantityReq: item.qty,
          prod_id: item.id,
        });

        prodItems.forEach((item) => {
          if (item.title === CPU) {
            console.log("cpu-item", item);

            loadeditems.push({
              quantityReq: quantity,
              prod_id: item._id,
            });
          }
          if (item.title === MONITOR) {
            console.log("monitor-item", item);

            loadeditems.push({
              quantityReq: quantity,
              prod_id: item._id,
            });
          }
        });
      } else {
        loadeditems.push({
          quantityReq: item.qty,
          prod_id: item.id,
        });

        // cart.forEach((item) => {
        //   if (item.qty <= 0 || item.qty == "") {
        //     flag = true;
        //   }
        //   if (item.prodType === "Others") {
        //     loadeditems.push({
        //       quantityReq: item.qty,
        //       prod_id: item.id,
        //     });
        //   }
        // });
      }
    });

    // }

    let parseIntercomNumber = intercomNumber;

    const sentOrderObject = {
      cat_id: cart[0].catId,
      products: [...loadeditems],
      branch: BRANCH,
      designation: DESIGNATION,
      intercom: parseIntercomNumber,
      justification: justification,
      fileNumber: checkboxData,
      strength: indentedFor,
      // orderType:"",
      name: NAME,
      irla: irla,
      Empid: Empid,
      employee_id: tempData,
    };

    console.log("sentOrderobject is ", sentOrderObject);

    if (flag) {
      Toast("Item must be greater than zero", "error");
      setTimeout(() => {
        flag = false;
      }, 0);
    } else {
      try {
        const res = await axios.request({
          method: "POST",
          url: `${BASE_URL}/api/orders`,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          data: sentOrderObject,
        });
        if (res.status == 200) {
          handleClose();
          dispatch(fetchUsersCart());
          Toast("Orders Placed Successfully", "success");
          history.push("/orders");
        }
      } catch (err) {}
    }
  };
  return (
    <>
      <NavigationBar />
      <div className="flex-box">
        <SideBar />
        <div className="cart container-fluid">
          <div className="cart-head text-center"> Your Cart </div>
          <div className="cart-head-2">
            "{cartLength} Products in your Cart"
          </div>
          <div className="place-ord-row">
            {showBtn && (
              <button
                className="btn btn-primary place-ord-btn"
                onClick={() => {
                  addOrder("---", 0, "");
                }}
                type="submit"
              >
                Place Order
              </button>
            )}
          </div>
          {console.log(radioSelect, "selected")}
          <div className="main_content">{CartItems()}</div>
          <IntercomModal
            cartTitle={cart_title}
            show={show}
            addProduct={addOrder}
            handleClose={handleClose}
            setRadioSelect={setRadioSelect}
          />
        </div>
      </div>
    </>
  );
}

export default Cart;
