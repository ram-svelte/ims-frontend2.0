import { useState, useContext } from "react";
import "../css/ProductDetailsList.css";
import { Container } from "react-bootstrap";
import { BASE_URL } from "../Urls";
import { useDispatch,useSelector } from "react-redux";
import { fetchUsersCart } from "../redux/action";
import { Toast } from "../Utils/Toastify";
import axios from "axios";
import { MyContext } from "../context/index";
import CartModal from "../UI/CartModal";
import CartIfDesktop from "../UI/CartIfDesktop";
import { CPU, DESKTOP, MONITOR } from "../Constant";

const ProductDetailsList = (props) => {
  const [counter, setCounter] = useState(1);
  const dispatch = useDispatch();
  const description = props.description;
  const imagesArray = props.image;
  const title = props.title;
  const context = useContext(MyContext);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  const access_token = localStorage.getItem("jwtToken");
  let addedItems=[props.item]
  // console.log("props.item",props.catId._id)
  const cart = useSelector((state) => state.handleCart.cart);


  console.log("cart in product details",cart);

  const isDesktop = cart.some((item) => item.title === DESKTOP);
  const isCPU = cart.some((item) => item.title === CPU);
  const isMonitor = cart.some((item) => item.title === MONITOR);
  console.log("isDesktop", isDesktop);

  const imageHandler = (i) => {
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

  return (
    <>
      <Container className="productdetail_container">
        <div className="d-flex flex-row justify-content-space-around ">
          <div className="image_div">{imageDiv}</div>
          <div className="main_product_image_container">
            <img className="main_product_image" src={imagesArray[index]} />
          </div>
          <div>
            <div>
              <p className="main_product_title">{title}</p>
              <hr />
              <p className="main_product_description">{description}</p>
            </div>
            <div className="d-flex flex-row">
              <div>
                <input
                  type="number"
                  onChange={handleCount}
                  value={counter}
                  placeholder="Add item"
                  className="form-control"
                ></input>
              </div>
              <div>
                <button
                  className="btn btn-primary add_cart"
                  onClick={addProduct}
                  type="submit"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
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
