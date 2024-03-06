(document.querySelectorAll("[toast-list]") ||
  document.querySelectorAll("[data-choices]") ||
  document.querySelectorAll("[data-provider]")) &&
  (document.writeln(
    "<script type='text/javascript' src='https://cdn.jsdelivr.net/npm/toastify-js'></script>"
  ),
  document.writeln(
    "<script type='text/javascript' src='../assets/libs/choices.js/public/assets/scripts/choices.min.js'></script>"
  ),
  document.writeln(
    "<script type='text/javascript' src='../assets/libs/flatpickr/flatpickr.min.js'></script>"
  ));
const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");

if (token && username) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("username").innerHTML = username.split("@")[0];
}

async function downloadPicture(picId) {
  try {
    const imageData = await fetch(`http://127.0.0.1:4000/item/files/${picId}`);

    if (imageData.ok) {
      const blobData = await imageData.blob();
      const imageURL = URL.createObjectURL(blobData);
      return imageURL;
    } else {
      throw new Error(`Failed to fetch image for ${picId}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getItemAndPic() {
  try {
    const itemAndPic = await fetch("http://127.0.0.1:4000/items");

    if (itemAndPic.ok) {
      const itemdata = await itemAndPic.json();

      itemdata.forEach(async (item) => {
        const itempic = await downloadPicture(item.mediaFilesPicture[0]);
        const itemDiv = `<div class="element-item col-xxl-3 col-xl-4 col-sm-6 seller hot arrival" data-category="hot arrival" >
          <form class="hot_arrival">
          <input type="text" hidden value="${item._id}">
          <div class="card overflow-hidden">
              <div class="bg-warning-subtle rounded-top py-4">
                  <div class="gallery-product">
                      <img src="${itempic}" alt="" style="max-height: 215px;max-width: 100%;" class="mx-auto d-block">
                  </div>
                  ${
                    item.bestArrival
                      ? `<p class="fs-11 fw-medium badge bg-primary py-2 px-3 product-lable mb-0">Best Arrival</p>`
                      : ""
                  }
                  <div class="gallery-product-actions">
                     <div class="mb-2">
                          <button type="button" class="btn btn-danger btn-sm custom-toggle" data-bs-toggle="button">
                              <span class="icon-on"><i class="mdi mdi-heart-outline align-bottom fs-15"></i></span>
                              <span class="icon-off"><i class="mdi mdi-heart align-bottom fs-15"></i></span>
                          </button>
                     </div>
  
                     <div>
                          <button type="button" class="btn btn-success btn-sm custom-toggle" data-bs-toggle="button">
                              <span class="icon-on"><i class="mdi mdi-eye-outline align-bottom fs-15"></i></span>
                              <span class="icon-off"><i class="mdi mdi-eye align-bottom fs-15"></i></span>
                          </button>
                     </div>
                  </div>
                  <div class="product-btn px-3" id="add_to_cart_btn">
                      <a class="btn btn-primary btn-sm w-75 add-btn"><i class="mdi mdi-cart me-1"></i> Add to cart</a>
                  </div>
              </div>
              <div class="card-body">
                  <div>
                      <a href="product-details.html">
                          <h6 class="fs-15 lh-base text-truncate mb-0">${
                            item.productTitle
                          }</h6>
                      </a>
                      <div class="mt-3">
                          <span class="float-end">4.9 <i class="ri-star-half-fill text-warning align-bottom"></i></span>
                          <h5 class="mb-0">₦${
                            item.price
                          } <span class="text-muted fs-12"><del>₦${
          item.price
        }</del></span></h5>
                      </div>
                  </div>
              </div>
          </div>
          </form>
      </div>`;
        // img.setAttribute('src', );
        document.getElementById("goods").innerHTML += itemDiv;

        // Add event listeners after inserting elements
        const addBtns = document.querySelectorAll(
          ".hot_arrival #add_to_cart_btn"
        );
        addBtns.forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            // Handle the button click event
            const productId =
              e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
                "input"
              ).value;
            //When its clicked, run add to cart function
            addToCart(productId);
            //Relax a bit then get the cart item again
            await getCartItems();
          });
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function addToCart(itemId) {
  const data = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const itemToCart = await fetch(`http://127.0.0.1:4000/cart/${itemId}`, data);
  if (itemToCart.ok) {
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
  const itemToCart = await fetch(`http://127.0.0.1:4000/cart/${itemId}`, data);
  if (itemToCart.ok) {
  }
}
getItemAndPic();

//Also download the item picture too in the getCartItem function;
async function getCartItems() {
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
    const response = await fetch("http://127.0.0.1:4000/cart", data);
    if (response.ok) {
      const items = await response.json();
      console.log(items);
      const { status, allItems } = items;
      document.getElementById("cartItemCount").innerHTML = allItems.length;

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
        console.log(document.getElementById("cartItemLists"));
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
        var removeProduct = document.getElementById("removeItemModal");
        if (removeProduct)
          removeProduct.addEventListener("show.bs.modal", function (e) {
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
          });
      });
    }
  } catch (error) {
    console.log(error);
  }
}
getCartItems();
