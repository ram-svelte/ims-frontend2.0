<div class="buttons">
  <button class="cart-button">
    <span class="add-to-cart">Add to cart</span>
    <span class="added">Item added</span> <i class="fa fa-shopping-cart"></i>
    <i class="fa fa-square"></i>
  </button>
</div>;

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
