const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");

if (token && username) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("username").innerHTML = username.split("@")[0];
}

//Also download the item picture too in the getCartItem function;
async function getCartItem() {
  console.log(token);
  //Get cart items
  try {
    const data = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("http://127.0.0.1:2500/carts", data);
    if (response.ok) {
      const items = await response.json();
      console.log(items);
      const { status, allItems } = items;
      document.getElementById("cart_page_cartItemLists").innerHTML =
        allItems.length;
      console.log(allItems);
      allItems.forEach((item) => {
        const itemDiv = `<li class="list-group-item product" id="cartItemForm">
          <input hidden value="${item._id}">
          <div class="d-flex gap-3">
              <div class="flex-shrink-0">
                  <div class="avatar-md" style="height: 100%;">
                      <div class="avatar-title bg-warning-subtle rounded-3">
                          <img src="images/img-4_1.png" alt="" class="avatar-sm">
                      </div>
                  </div>
              </div>
              <div class="flex-grow-1">
                  <a href="#!">
                      <h5 class="fs-15">${item.productTitle}</h5>
                  </a>
                  <div class="d-flex mb-3 gap-2">
                      <div class="text-muted fw-medium mb-0">₦<span class="product-price">${item.price}</span></div>
                      <div class="vr"></div>
                      <span class="text-success fw-medium">In Stock ${item.available}</span>
                  </div>
                  <div class="input-step">
                      <button type="button" class="minus">–</button>
                      <input type="number" class="product-quantity" value="2" min="0" max="100" readonly="">
                      <button type="button" class="plus">+</button>
                  </div>
              </div>
              <div class="flex-shrink-0 d-flex flex-column justify-content-between align-items-end">
                  <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn" data-bs-toggle="modal" data-bs-target="#removeItemModal"><i class="ri-close-fill fs-16"></i></button>
                  <div class="fw-medium mb-0 fs-16">₦<span class="product-line-price">${item.price}</span></div>
              </div>
          </div>
      </li>`;
        const cartItems = ` <div class="card product">
        <input hidden value="${item._id}">
      <div class="card-body p-4">
          <div class="row gy-3">
              <div class="col-sm-auto">
                  <div class="avatar-lg h-100">
                      <div class="avatar-title bg-secondary-subtle rounded py-3">
                          <img src="images/img-15.png" alt="" class="avatar-md">
                      </div>
                  </div>
              </div>
              <div class="col-sm">
                  <a href="#!">
                      <h5 class="fs-16 lh-base mb-1">${item.productTitle}</h5>
                  </a>
                  <ul class="list-inline text-muted fs-13 mb-3">
                      <li class="list-inline-item">Color : <span class="fw-medium"> ${
                        items.color ? item.color : " same as pic "
                      }</span></li>
                  </ul>
                  <div class="input-step">
                      <button type="button" class="minus">–</button>
                      <input type="number" class="product-quantity" value="1" min="0" max="100" readonly="">
                      <button type="button" class="plus">+</button>
                  </div>
              </div>
              <div class="col-sm-auto">
                  <div class="text-lg-end">
                      <p class="text-muted mb-1 fs-12">Item Price:</p>
                      <h5 class="fs-16">₦<span class="product-price">${
                        item.price
                      }</span></h5>
                  </div>
              </div>
          </div>
      </div>
      <div class="card-footer">
          <div class="row align-items-center gy-3">
              <div class="col-sm">
                  <div class="d-flex flex-wrap my-n1">
                      <div >
                          <a href="#!" class="d-block text-body p-1 px-2" data-bs-toggle="modal" data-bs-target="#removeItemModal"><i class="ri-delete-bin-fill text-muted align-bottom me-1"></i> Remove</a>
                      </div>
                      <div>
                          <a href="#!" class="d-block text-body p-1 px-2"><i class="ri-star-fill text-muted align-bottom me-1"></i> Add Wishlist</a>
                      </div>
                  </div>
              </div>
              <div class="col-sm-auto">
                  <div class="d-flex align-items-center gap-2 text-muted">
                      <div>Total :</div>
                      <h5 class="fs-14 mb-0">₦<span class="product-line-price">${
                        item.price
                      }</span></h5>
                  </div>
              </div>
          </div>
      </div>
      <!-- end card footer -->
  </div>`;
        document.getElementById("cart_checkout_list").innerHTML += cartItems;
        document.getElementById("cartItemLists").innerHTML += itemDiv;
        // cart dropdown

        // input spin
        isData();
        function isData() {
          var plus = document.getElementsByClassName("plus");
          var minus = document.getElementsByClassName("minus");
          var product = document.getElementsByClassName("product");

          if (plus) {
            Array.from(plus).forEach(function (e) {
              e.addEventListener("click", function (event) {
                // if(event.target.previousElementSibling.value )
                if (
                  parseInt(e.previousElementSibling.value) <
                  event.target.previousElementSibling.getAttribute("max")
                ) {
                  event.target.previousElementSibling.value++;
                  if (product) {
                    Array.from(product).forEach(function (x) {
                      updateQuantity(event.target);
                    });
                  }
                }
              });
            });
          }

          if (minus) {
            Array.from(minus).forEach(function (e) {
              e.addEventListener("click", function (event) {
                if (
                  parseInt(e.nextElementSibling.value) >
                  event.target.nextElementSibling.getAttribute("min")
                ) {
                  event.target.nextElementSibling.value--;
                  if (product) {
                    Array.from(product).forEach(function (x) {
                      updateQuantity(event.target);
                    });
                  }
                }
              });
            });
          }
        }

        var taxRate = 0.125;
        var shippingRate = 65.0;
        var discountRate = 0.15;

        var currencySign = "₦";
        var cartList = document.querySelectorAll(".cartlist li").length;
        document.querySelectorAll(".cartitem-badge").forEach(function (item) {
          item.innerHTML = cartList;
        });

        document.querySelectorAll(".product-list").forEach(function (elem) {
          elem.querySelectorAll(".product-count").forEach(function (subelem) {
            subelem.innerHTML = elem.querySelectorAll(".product").length;
          });
          recalculateCart(elem);
        });

        function recalculateCart(elm) {
          var subtotal = 0;

          Array.from(elm.getElementsByClassName("product")).forEach(function (
            item
          ) {
            Array.from(
              item.getElementsByClassName("product-line-price")
            ).forEach(function (e) {
              subtotal += parseFloat(e.innerHTML);
            });
          });

          /* Calculate totals */
          var tax = subtotal * taxRate;
          var discount = subtotal * discountRate;

          var shipping = subtotal > 0 ? shippingRate : 0;
          var total = subtotal + tax + shipping - discount;

          elm.querySelector(".cart-subtotal").innerHTML =
            currencySign + subtotal.toFixed(2);
          elm.querySelector(".cart-tax").innerHTML =
            currencySign + tax.toFixed(2);
          elm.querySelector(".cart-shipping").innerHTML =
            currencySign + shipping.toFixed(2);
          elm.querySelector(".cart-total").innerHTML =
            currencySign + total.toFixed(2);
          elm.querySelector(".cart-discount").innerHTML =
            "-" + currencySign + discount.toFixed(2);
        }

        function updateQuantity(quantityInput) {
          if (quantityInput.closest(".product")) {
            var productRow = quantityInput.closest(".product");
            var productList = quantityInput.closest(".product-list");
            var price;
            if (
              productRow ||
              productRow.getElementsByClassName("product-price")
            )
              Array.from(
                productRow.getElementsByClassName("product-price")
              ).forEach(function (e) {
                price = parseFloat(e.innerHTML);
              });

            if (
              quantityInput.previousElementSibling &&
              quantityInput.previousElementSibling.classList.contains(
                "product-quantity"
              )
            ) {
              var quantity = quantityInput.previousElementSibling.value;
            } else if (
              quantityInput.nextElementSibling &&
              quantityInput.nextElementSibling.classList.contains(
                "product-quantity"
              )
            ) {
              var quantity = quantityInput.nextElementSibling.value;
            }
            var linePrice = price * quantity;
            /* Update line price display and recalc cart totals */
            Array.from(
              productRow.getElementsByClassName("product-line-price")
            ).forEach(function (e) {
              e.innerHTML = linePrice.toFixed(2);
              recalculateCart(productList);
            });
          }
        }

        // Remove product from cart
        var removeProduct = document.querySelectorAll("#removeItemModal");
        if (removeProduct)
          removeProduct.forEach((product) =>
            product.addEventListener("show.bs.modal", function (e) {
              document
                .getElementById("remove-product")
                .addEventListener("click", function (event) {
                  e.relatedTarget.closest(".product").remove();
                  //Remove the item from the cart using its id;
                  const productToRemoveId = e.relatedTarget
                    .closest(".product")
                    .querySelector("input").value;
                  removeFromCart(productToRemoveId);
                 
                  
                  document.getElementById("close-modal").click();
                  document
                    .querySelectorAll(".cartitem-badge")
                    .forEach(function (item) {
                      item.innerHTML =
                        document.querySelectorAll(".cartlist li").length;
                    });

                  document
                    .querySelectorAll(".product-list")
                    .forEach(function (elem) {
                      elem
                        .querySelectorAll(".product-count")
                        .forEach(function (subelem) {
                          subelem.innerHTML =
                            elem.querySelectorAll(".product").length;
                        });
                      recalculateCart(elem);
                    });
                });
            })
          );
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function removeFromCart(itemId) {
  const data = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const itemToCart = await fetch(`http://127.0.0.1:2500/cart/${itemId}`, data);
  if (itemToCart.ok) {
    getCartItem();
  }
}
getCartItem();


//Get the item image from the database and set it as the cary item image;
