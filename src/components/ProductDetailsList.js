import { useState, useContext } from "react";
import "../css/ProductDetailsList.css";
import { Container } from "react-bootstrap";
import { BASE_URL } from "../Urls";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersCart } from "../redux/action";
import { Toast } from "../Utils/Toastify";
import axios from "axios";
import { MyContext } from "../context/index";
import CartModal from "../UI/CartModal";
import CartIfDesktop from "../UI/CartIfDesktop";
import { CPU, DESKTOP, MONITOR } from "../Constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const ProductDetailsList = (props) => {
  const [counter, setCounter] = useState(1);
  const dispatch = useDispatch();
  // const description = props.description;
  // const infoSegments = props.description.split(".");
  const trimmedInfo = props.description.trim(); // Trim leading and trailing spaces
  const infoSegments = trimmedInfo.split(". ");
  const description = infoSegments.map((segment, index) => (
    <li key={index}>{segment}</li>
  ));
  const imagesArray = props.image;
  const title = props.title;
  const context = useContext(MyContext);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  const access_token = sessionStorage.getItem("jwtToken");
  let addedItems = [props.item];
  // console.log("props.item",props.catId._id)
  const cart = useSelector((state) => state.handleCart.cart);

  console.log("cart in product details", cart);

  const isDesktop = cart.some((item) => item.title === DESKTOP);
  const isCPU = cart.some((item) => item.title === CPU);
  const isMonitor = cart.some((item) => item.title === MONITOR);
  console.log("isDesktop", isDesktop);
  const [isWhislist, setisWhislist] = useState(false);
  const imageHandler = (i) => {
    console.log("Mouseover triggered for index:", i);
    setIndex(i);
  };
  const handleCount = (e) => {
    setCounter(e.target.value);
  };

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
        if (props.catId._id != context.categoryId) {
          handleShow();
          return;
        }
      }
    }

    if (counter > 0) {
      //props.qty = counter;
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
      let transformedProduct = {
        quantityReq: counter,
        prod_id: props.id,
        cat_id: props.catId._id,
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

  const imageDiv = imagesArray.map((item, index) => {
    return (
      <>
        <div className="product_image_container">
          <img
            src={item}
            alt="AltText"
            key={index}
            onMouseOver={() => imageHandler(index)}
          />
        </div>
      </>
    );
  });
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
  const handleClickWhislist = () => {
    setisWhislist(!isWhislist);
  };

  const images = [
    { name: "PC", path: "/img/image1.png" },
    { name: "CPU", path: "/img/image2.png" },
    { name: "Printer", path: "/img/image3.png" },
    { name: "Laptop", path: "/img/image4.png" },
  ];
  return (
    // <>
    //   <Container className="productdetail_container ">
    //     <div className="d-flex flex-row justify-content-space-around  ">
    //       <div className="image_div">{imageDiv}</div>
    //       <div className="inner_container d-flex">
    //         <div className="main_product_image_container ">
    //           <span className="wishlist-icon " onClick={handleClickWhislist}>
    //             {isWhislist ? (
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="28"
    //                 height="28"
    //                 fill="currentColor"
    //                 className="bi bi-suit-heart-fill "
    //                 viewBox="0 0 16 16"
    //               >
    //                 <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
    //               </svg>
    //             ) : (
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="28"
    //                 height="28"
    //                 fill="currentColor"
    //                 className="bi bi-suit-heart-fill "
    //                 viewBox="0 0 16 16"
    //               >
    //                 <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
    //               </svg>
    //             )}{" "}
    //           </span>
    //           <div className="d-flex justify-content-center align-middle">
    //             <img className="main_product_image" src={imagesArray[index]} />
    //           </div>
    //         </div>

    //         <div>
    //           <p className="main_product_title">{title}</p>
    //           <hr />
    //           <p className="main_product_description">
    //             <ul>{description}</ul>
    //           </p>
    //         </div>
    //         <div className="d-flex flex-row align-middle justify-content-center">
    //           {/* <input
    //               type="number"
    //               onChange={handleCount}
    //               value={counter}
    //               placeholder="Add item"
    //               className="form-control"
    //             ></input> */}

    //           <div className="cart-input my-3 d-flex  flex-row align-middle justify-content-center ">
    //             <div>
    //               <FontAwesomeIcon
    //                 style={{
    //                   color: "black",
    //                   cursor: "pointer",
    //                   marginTop: "6px",
    //                 }}
    //                 className="dec-cart"
    //                 icon={faMinusCircle}
    //                 onClick={decreaseCounter}
    //               />
    //             </div>

    //             <div className="w-30" style={{ width: "5rem", padding: "" }}>
    //               <input
    //                 type="number"
    //                 value={counter}
    //                 className="form-control p-1"
    //                 // style={{ marginLeft: "100px" }}
    //                 // onChange={handlingCart}
    //                 onChange={handleCount}
    //                 disabled
    //               ></input>
    //             </div>

    //             <div>
    //               {" "}
    //               <FontAwesomeIcon
    //                 style={{
    //                   color: "black",
    //                   cursor: "pointer",
    //                   marginTop: "6px",
    //                 }}
    //                 className="inc-cart"
    //                 icon={faPlusCircle}
    //                 onClick={incrementCount}
    //               />
    //             </div>
    //           </div>
    //           <div>
    //             <button
    //               className="btn btn-primary add_cart"
    //               onClick={addProduct}
    //               type="submit"
    //             >
    //               Add to Cart
    //             </button>
    //           </div>
    //         </div>

    //       </div>
    //     </div>

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
    //   </Container>
    // </>
    <>
      <Container className="productdetail_container ">
        <div
          style={{
            color: "white",
            marginBottom: "4px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {title}
        </div>
        <div className="d-flex">
          <div className="image_div">{imageDiv}</div>

          <div className="product_container d-flex">
            <div>
              <img className="main_product_image" src={imagesArray[index]} />
            </div>

            <div style={{ marginLeft: "8px" }}>
              <div>
                <p className="main_product_title">{title}</p>
                <hr />
                <div>
                  <p className="main_product_description">
                    <ul>{description}</ul>
                  </p>
                </div>
                {/* <p className="main_product_description">
                  <ul>{description}</ul>
                </p> */}
              </div>
              <div
                className="d-flex flex-row align-item-center"
                style={{ marginBottom: "8px" }}
              >
                <div>
                  <FontAwesomeIcon
                    style={{
                      color: "black",
                      cursor: "pointer",
                      marginTop: "6px",
                    }}
                    className="dec-cart"
                    icon={faMinusCircle}
                    onClick={decreaseCounter}
                  />
                </div>

                <div className="w-30" style={{ width: "5rem", padding: "" }}>
                  <input
                    type="number"
                    value={counter}
                    className="form-control p-1"
                    // style={{ marginLeft: "100px" }}
                    // onChange={handlingCart}
                    onChange={handleCount}
                    disabled
                  ></input>
                </div>

                <div>
                  {" "}
                  <FontAwesomeIcon
                    style={{
                      color: "black",
                      cursor: "pointer",
                      marginTop: "6px",
                    }}
                    className="inc-cart"
                    icon={faPlusCircle}
                    onClick={incrementCount}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary add_cart mt-0"
                    onClick={addProduct}
                    type="submit"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex " style={{ marginLeft: "-6px" }}>
          {images.map((image, index) => {
            return (
              <div className="footer-product" style={{ marginLeft: "10px" }}>
                <div style={{ marginLeft: "10px", fontSize: "16px" }}>
                  {image.name || "Dell Desktop PC"}
                </div>
                {/* <div >{img}</div> */}
                <div className="product-img">
                  <img
                    className=""
                    src={process.env.PUBLIC_URL + image.path}
                    alt={image.name}
                  />
                </div>
                <div className="footer-add-to-cart">
                  <div className="d-flex flex-row align-item-center">
                    <div>
                      <FontAwesomeIcon
                        style={{
                          color: "white",
                          cursor: "pointer",
                          marginTop: "6px",
                        }}
                        className="dec-cart"
                        icon={faMinusCircle}
                        // onClick={decreaseCounter}
                      />
                    </div>

                    <div
                      className="w-30"
                      style={{ width: "5rem", padding: "" }}
                    >
                      <input
                        type="number"
                        value={counter}
                        className="form-control p-1"
                        style={{ marginTop: "2px", width: "4rem" }}
                        // onChange={handlingCart}
                        // onChange={handleCount}
                        disabled
                      ></input>
                    </div>

                    <div style={{ marginLeft: "0px" }}>
                      <FontAwesomeIcon
                        style={{
                          color: "white",
                          cursor: "pointer",
                          marginTop: "6px",
                        }}
                        className="inc-cart"
                        icon={faPlusCircle}
                        // onClick={incrementCount}
                      />
                    </div>
                    <div style={{ marginTop: "4px", marginLeft: "4px" }}>
                      <button
                        className="btn btn-primary add-to-cart-btn mt-0"
                        // onClick={addProduct}
                        type="submit"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
      </Container>
    </>
  );
};

export default ProductDetailsList;
