import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersCart } from "../redux/action";
import { useState } from "react";
import { BASE_URL } from "../Urls";
import axios from "axios";
import { Toast } from "../Utils/Toastify";
import { useParams, Link } from "react-router-dom";
import { MyContext } from "../context/index";
import CartModal from "../UI/CartModal";
import "../css/ProductList.css";
import { CPU, DESKTOP, MONITOR } from "../Constant";
import CartIfDesktop from "../UI/CartIfDesktop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function ProductList(props) {
  console.log("props are ", props);
  const [counter, setCounter] = useState(1);
  const context = useContext(MyContext);
  const access_token = localStorage.getItem("jwtToken");
  const params = useParams();
  const dispatch = useDispatch();
  const catId = props.catId;
  console.log("catId is -----", catId);
  const catTitle = props.catTitle;
  const cart = useSelector((state) => state.handleCart.cart);
  //const catId = params.categoryId;
  // let catTitle = context.catTitle;
  // if (params.categoryTitle) {
  //   catTitle = params.categoryTitle.toLowerCase();
  // } else {
  //   catTitle = context.catTitle;
  // }

  // const isDesktop = true

  const isDesktop = cart.some((item) => item.title === DESKTOP);
  const isCPU = cart.some((item) => item.title === CPU);
  const isMonitor = cart.some((item) => item.title === MONITOR);
  console.log("isDesktop", isDesktop);

  let active = false;
  console.log("props.title", props.title);
  console.log("catTitle", catTitle);
  console.log("catId is ", catId);
  console.log("cart", cart);

  const handleCount = (e) => {
    setCounter(e.target.value);
  };

  if (catTitle === "stationary") {
    active = true;
  }

  // console.log("mhfjhkjf")

  const [show, setShow] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleCloseDesktop = () => {
    setShowDesktop(false);
  };
  const handleShowDesktop = () => setShowDesktop(true);

  const addProduct = async (x) => {
    if (x !== 1) {
      if (context.categoryId !== "") {
        if (props.catId != context.categoryId) {
          handleShow();
          return;
        }
      }
    }

    if (counter > 0) {
      if (
        isDesktop === true &&
        (props.title === CPU || props.title === MONITOR)
      ) {
        handleShowDesktop();
        return;
      } else if (isCPU === true && props.title === DESKTOP) {
        handleShowDesktop();
        return;
      } else if (isMonitor === true && props.title === DESKTOP) {
        handleShowDesktop();
        return;
      }
      props.item.qty = counter;
      let transformedProduct = {
        quantityReq: props.item.qty,
        prod_id: props.id,
        cat_id: props.catId,
      };

      try {
        const res = await axios.request({
          method: "POST",
          url: `${BASE_URL}/api/cart`,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          data: transformedProduct,
        });
        if (res.status == 201) {
          dispatch(fetchUsersCart());
          if (x) {
            handleClose();
          }
          Toast("Item added Successfully", "success");
        }
      } catch (err) {}
    }
  };
  const incrementCount = async () => {
    if (counter > 0) {
      setCounter(counter + 1);
    }
  };
  const decreaseCounter = async () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };
  return (
    // <div key={props.id} className="stat-prod">
    //   {/* only for opening product detail page of computeres and hovering of stationary  */}
    //   {/* <div className={` ${active ? "img__wrap" : "non_hover_img__wrap"}`}>
    //     <Link
    //       style={catTitle === "stationary" ? { pointerEvents: "none" } : null}
    //       to={`/product/${catId}/${props.id}`}
    //     >
    //       <img className="img__img" src={props.imageSrc} />
    //     </Link>

    //     <p className="img__description">{props.description}</p>
    //   </div> */}

    //   <>
    //     <CartModal
    //       show={show}
    //       addProduct={addProduct}
    //       handleClose={handleClose}
    //     />
    //     <CartIfDesktop
    //       show={showDesktop}
    //       // addProduct={addProduct}
    //       handleClose={handleCloseDesktop}
    //     />
    //   </>

    //   <div className="stat-txt my-3">{props.title}</div>
    //   {props.qty != 0 ? (
    //     <div className="add-cart">
    //       <div className="form-group">
    //         <input
    //           type="number"
    //           onChange={handleCount}
    //           value={counter}
    //           placeholder="Add item"
    //           className="form-control"
    //         ></input>
    //         <button
    //           className="btn btn-primary"
    //           onClick={addProduct}
    //           type="submit"
    //         >
    //           Add to Cart
    //         </button>
    //         {/* <AddItemButton onClick={addProduct} /> */}
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="out-stock"> Out of Stock</div>
    //   )}
    // </div>
    <>
      <div
        key={props.id}
        className="product-container"
        style={{ marginLeft: "10px" }}
      >
        <div style={{ marginLeft: "10px", fontSize: "16px" }}>
          {props.title}
        </div>
        <div className="multiple-product-img">
          <Link
            style={catTitle === "stationary" ? { pointerEvents: "none" } : null}
            to={`/product/${catId}/${props.id}`}
          >
            <img className="" src={props.imageSrc} />
          </Link>
        </div>
        <>
          <CartModal
            show={show}
            addProduct={addProduct}
            handleClose={handleClose}
          />
          <CartIfDesktop
            show={showDesktop}
            // addProduct={addProduct}
            handleClose={handleCloseDesktop}
          />
        </>

        {props.qty != 0 ? (
          <div className="add-to-cart">
            <div className="d-flex flex-row align-item-center gap-2">
              <div style={{ marginRight: "-5px", marginTop: "2px" }}>
                <FontAwesomeIcon
                  style={{
                    color: "white",
                    cursor: "pointer",
                    marginTop: "6px",
                  }}
                  className="dec-cart"
                  icon={faMinusCircle}
                  onClick={decreaseCounter}
                />
              </div>

              <div className="" style={{ width: "5rem" }}>
                <input
                  type="number"
                  className="form-control p-1"
                  style={{ marginTop: "2px", width: "4rem" }}
                  onChange={handleCount}
                  value={counter}
                  placeholder="Add item"
                  disabled
                ></input>
              </div>

              <div style={{ marginLeft: "-18px", marginTop: "2px" }}>
                <FontAwesomeIcon
                  style={{
                    color: "white",
                    cursor: "pointer",
                    marginTop: "6px",
                  }}
                  className="inc-cart"
                  icon={faPlusCircle}
                  onClick={incrementCount}
                />
              </div>
              <div style={{ marginTop: "4px", marginLeft: "10px" }}>
                <button
                  className="btn btn-primary add-to-cart-btn mt-0"
                  onClick={addProduct}
                  type="submit"
                >
                  <span style={{ fontSize: "12px" }}>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="out-stock"> Out of Stock</div>
        )}
      </div>
    </>
  );
}

export default ProductList;
