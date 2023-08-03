import react from "react";
import '../css/AddItemButton.css'
import { faShoppingCart, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddItemButton() {
  document.addEventListener("DOMContentLoaded", function (event) {
    const cartButtons = document.querySelectorAll(".cart-button");

    cartButtons.forEach((button) => {
      button.addEventListener("click", cartClick);
    });

    function cartClick() {
      let button = this;
      button.classList.add("clicked");
    }
  });

  return (
    <div className="buttons">
      <button className="cart-button">
        <span className="add-to-cart">Add to cart</span>
        <span className="added">Item added</span>{" "}
        <i className="fa fa-shopping-cart"></i>
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="fa fa-shopping-cart"
        />
        <FontAwesomeIcon icon={faShoppingCart} className="fa fa-square" />
      </button>
    </div>
  );
}

export default AddItemButton;
