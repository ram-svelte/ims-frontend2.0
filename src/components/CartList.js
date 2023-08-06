import React from "react";
import "../css/cart.css";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersCart } from "../redux/action";
import axios from "axios";
import { BASE_URL } from "../Urls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function CartList(props) {
  const access_token = localStorage.getItem("jwtToken");
  const cart = useSelector((state) => state.handleCart.cart);
  const currentCartItem = cart.find((x) => x.id === props.item.id);
  let counter = currentCartItem.qty;
  const dispatch = useDispatch();
  const [count, setCount] = useState(props.qty);
  const obj1 = { ...props.item };
  const MIN_QTY = 1;

  const addProduct = async (qty) => {
    let transformedProduct = {
      quantityReq: qty,
      prod_id: props.item.id,
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
      }
    } catch (err) {}
  };

  const handlingCart = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
    }

    if (e.target.value == 0) {
      setCount(MIN_QTY);
    }

    if (+e.target.value == 0) {
      counter = "";
      obj1.qty = +e.target.value;
      addProduct(obj1.qty);
      setCount(counter);
    } else if (+e.target.value < 0) {
      counter = MIN_QTY;
      setCount(counter);
      obj1.qty = MIN_QTY;
      addProduct(obj1.qty);
    } else {
      counter = +e.target.value;
      obj1.qty = +e.target.value;
      addProduct(obj1.qty);
      setCount(+e.target.value);
    }
  };

  const incrementCount = async () => {
    if (counter >= 1) {
      let transformedProduct = {
        flag: "add",
        prod_id: props.item.id,
      };
      try {
        const res = await axios.request({
          method: "POST",
          url: `${BASE_URL}/api/cart/cartQuantityUpdates`,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          data: transformedProduct,
        });
        if (res.status == 200) {
          setCount(props.qty + 1);
          dispatch(fetchUsersCart());
        }
      } catch (err) {}
    }
  };

  const deleteItem = async () => {
    const deleteProductId = currentCartItem.id;
    try {
      const res = await axios.request({
        method: "DELETE",
        url: `${BASE_URL}/api/cart/${deleteProductId}`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (res.status == 200) {
        dispatch(fetchUsersCart());
      }
    } catch (err) {}
  };

  const decreaseCounter = async () => {
    if (counter >= 2) {
      let transformedProduct = {
        flag: "remove",
        prod_id: props.item.id,
      };
      try {
        const res = await axios.request({
          method: "POST",
          url: `${BASE_URL}/api/cart/cartQuantityUpdates`,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          data: transformedProduct,
        });
        if (res.status == 200) {
          setCount(props.qty - 1);
          dispatch(fetchUsersCart());
        }
      } catch (err) {}
    }
  };

  return (
    <div key={props.id} className="cart-prod">
      <div className="cart-prod-inner">
        <img alt="AltText" src={props.imageSrc} className="cart-imgsize" />
      </div>
      <div className="order-cart">
        <div className="cart-txt my-3">{props.title}</div>
        <div className="cart-input my-3">
          <FontAwesomeIcon
            style={{ color: "#337ED7", cursor:"pointer"}}
            className="dec-cart"
            icon={faMinusCircle}
            onClick={decreaseCounter}
          />
          <input
            type="number"
            value={count}
            className="form-control"
            onChange={handlingCart}
            disabled
          ></input>
          <FontAwesomeIcon
            style={{ color: "#337ED7", cursor: "pointer" }}
            className="inc-cart"
            icon={faPlusCircle}
            onClick={incrementCount}
          />
        </div>
      </div>

      <button
        className="btn btn-primary order-btn"
        onClick={deleteItem}
        type="submit"
      >
        Delete
      </button>
    </div>
  );
}

export default CartList;