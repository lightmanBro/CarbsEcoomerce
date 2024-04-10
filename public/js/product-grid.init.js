/*
Template Name: Toner eCommerce + Admin HTML Template
Author: Themesbrand
Version: 1.2.0
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: product grid list init Js File
*/
/*
1.View Product details and add it as a recentlyViewedItem
DONE 2.Add to cart
3.Add to wish list,
DONE 4.Filter
*/
const accessToken = sessionStorage.getItem("token");
console.log("on product page");
async function downloadPicture(picId) {
  try {
    const imageData = await fetch(`http://127.0.0.1:2500/item/files/${picId}`);

    if (imageData.ok) {
      const blobData = await imageData.blob();
      const imageURL = URL.createObjectURL(blobData);
      // console.log(imageURL);
      return imageURL;
    } else {
      throw new Error(`Failed to fetch image for ${picId}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getProducts() {
  try {
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`http://127.0.0.1:2500/items`, header);

    if (response.ok) {
      const productList = await response.json();
      loadProductList(productList, currentPage);
      productListData.push(...productList);
    //   console.log(productListData);
    } else {
      // Handle non-successful response
      const errorData = await response.json();
      console.log(errorData);
      return errorData.message;
    }
  } catch (error) {
    // Handle errors
    console.error("Error during authentication:", error.message);
  }
}
getProducts()
// async function getCart() {
//     try {
//       const header = {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//       };
//       const response = await fetch(`http://127.0.0.1:2500/carts`, header);
  
//       if (response.ok) {
//         const items = await response.json();
//         // console.log(items);
//       } else {
//         // Handle non-successful response
//         const errorData = await response.json();
//         console.log(errorData);
//         return errorData.message;
//       }
//     } catch (error) {
//       // Handle errors
//       console.error("Error during authentication:", error.message);
//     }
//   }
//   getCart();
var productListData = [];

var prevButton = document.getElementById("page-prev");
var nextButton = document.getElementById("page-next");

// configuration variables
var currentPage = 1;
var itemsPerPage;

if (document.getElementById("col-3-layout")) {
  itemsPerPage = 12;
} else {
  itemsPerPage = 9;
}

loadProductList(productListData, currentPage);
paginationEvents();

async function loadProductList(datas, page) {
  var pages = Math.ceil(datas.length / itemsPerPage);
  if (page < 1) page = 1;
  if (page > pages) page = pages;

  if (document.getElementById("product-grid")) {
    document.getElementById("product-grid").innerHTML = "";
    for (
      var i = (page - 1) * itemsPerPage;
      i < page * itemsPerPage && i < datas.length;
      i++
    ) {
      if (datas[i]) {
        var checkinput = datas[i].wishList ? "active" : "";
        var num = 1;
        var colorElem = "";
        if (datas[i].color) {
          colorElem = `<ul class="clothe-colors list-unstyled hstack gap-1 mb-3 flex-wrap">
                                    ${datas[i].color
                                      .map(
                                        (elem) => `
                                        <li>
                                            <input type="radio" name="sizes${
                                              datas[i]._id
                                            }" id="product-color-${
                                          datas[i]._id
                                        }">
                                            <label class="avatar-xxs btn btn-${elem} p-0 d-flex align-items-center justify-content-center rounded-circle" for="product-color-${
                                          datas[i]._id
                                        }${num++}"></label>
                                        </li>`
                                      )
                                      .join("")}
                                 </ul>`;
        } else if (datas[i].size) {
          colorElem = `<ul class="clothe-size list-unstyled hstack gap-2 mb-3 flex-wrap">
                                    ${datas[i].size
                                      .map(
                                        (elem) => `
                                        <li>
                                            <input type="radio" name="sizes${
                                              datas[i]._id
                                            }" id="product-color-${
                                          datas[i]._id
                                        }">
                                            <label class="avatar-xxs btn btn-soft-primary text-uppercase p-0 fs-12 d-flex align-items-center justify-content-center rounded-circle" for="product-color-${
                                              datas[i]._id
                                            }${num++}">${elem}</label>
                                        </li>`
                                      )
                                      .join("")}
                                 </ul>`;
        } else {
          colorElem = `<div class="avatar-xxs mb-3">
                                    <div class="avatar-title bg-light text-muted rounded cursor-pointer">
                                        <i class="ri-error-warning-line"></i>
                                    </div>
                                </div>`;
        }

        var discount = datas[i].discount;
        var afterDiscount = datas[i].price - (datas[i].price * discount) / 100;
        var discountElem =
          discount > 0
            ? `<div class="avatar-xs label">
                                                        <div class="avatar-title bg-danger rounded-circle fs-11">${datas[i].discount}</div>
                                                    </div>`
            : "";
        var afterDiscountElem =
          discount > 0
            ? `<h5 class="text-secondary mb-0">$${afterDiscount.toFixed(
                2
              )} <span class="text-muted fs-12"><del>$${
                datas[i].price
              }</del></span></h5>`
            : `<h5 class="text-secondary mb-0">$${datas[i].price}</h5>`;

        var layout = document.getElementById("col-3-layout")
          ? '<div class="col-xxl-3 col-lg-4 col-md-6">'
          : '<div class="col-xxl-4 col-lg-4 col-md-6">';

        document.getElementById("product-grid").innerHTML += `${layout}
                              <div class="card ecommerce-product-widgets border-0 rounded-0 shadow-none overflow-hidden">
                                  <div class="bg-light bg-opacity-50 rounded py-4 position-relative">
                                      <img src="${await downloadPicture(
                                        datas[i].mediaFilesPicture[0]
                                      )}" alt="" style="max-height: 100%;max-width: 100%;" class="mx-auto d-block rounded-2">
                                      <div class="action vstack gap-2">
                                          <button class="btn btn-danger avatar-xs p-0 btn-soft-warning custom-toggle product-action ${checkinput}" data-bs-toggle="button">
                                              <span class="icon-on"><i class="ri-heart-line"></i></span>
                                              <span class="icon-off"><i class="ri-heart-fill"></i></span>
                                          </button>
                                      </div>
                                      ${discountElem}
                                  </div>
                                  <div class="pt-4">
                                      <div>
                                          ${colorElem}
                                          <a href="#!">
                                              <h6 class="text-capitalize fs-15 lh-base text-truncate mb-0">${
                                                datas[i].productTitle
                                              }</h6>
                                          </a>
                                          <div class="mt-2">
                                              <span class="float-end">${
                                                datas[i].rating
                                                  ? datas[i].rating
                                                  : ""
                                              } <i class="ri-star-half-fill text-warning align-bottom"></i></span>
                                              ${afterDiscountElem}
                                          </div>
                                          <div class="tn mt-3 add-cart-btn" id="${
                                            datas[i]._id
                                          }">
                                              <a href="#!" class="btn btn-primary btn-hover w-100 add-btn"><i class="mdi mdi-cart me-1"></i> Add To Cart</a>
                                          </div>
                                          
                                      </div>
                                  </div>
                              </div>
                          </div>`;
      }
    }
  }

  if (document.getElementById("product-grid-right")) {
    document.getElementById("product-grid-right").innerHTML = "";
    for (
      var i = (page - 1) * itemsPerPage;
      i < page * itemsPerPage && i < datas.length;
      i++
    ) {
      if (datas[i]) {
        var checkinput = datas[i].wishList ? "active" : "";
        var productLabel = datas[i].arrival
          ? '<p class="fs-11 fw-medium badge bg-primary py-2 px-3 product-lable mb-0">Best Arrival</p>'
          : "";
        var num = 1;
        var colorElem = "";
        if (datas[i].color) {
          colorElem = `<ul class="clothe-colors list-unstyled hstack gap-1 mb-3 flex-wrap d-none">
                                    ${datas[i].color
                                      .map(
                                        (elem) => `
                                        <li>
                                            <input type="radio" name="sizes${
                                              datas[i]._id
                                            }" id="product-color-${
                                          datas[i]._id
                                        }${num++}">
                                            <label class="avatar-xxs btn btn-${elem} p-0 d-flex align-items-center justify-content-center rounded-circle" for="product-color-${
                                          datas[i].id
                                        }${num}"></label>
                                        </li>`
                                      )
                                      .join("")}
                                 </ul>`;
        } else if (datas[i].size) {
          colorElem = `<ul class="clothe-size list-unstyled hstack gap-2 mb-3 flex-wrap d-none">
                                    ${datas[i].size
                                      .map(
                                        (elem) => `
                                        <li>
                                            <input type="radio" name="sizes${
                                              datas[i]._id
                                            }" id="product-color-${
                                          datas[i]._id
                                        }${num++}">
                                            <label class="avatar-xxs btn btn-soft-primary text-uppercase p-0 fs-12 d-flex align-items-center justify-content-center rounded-circle" for="product-color-${
                                              datas[i].id
                                            }${num}">${elem}</label>
                                        </li>`
                                      )
                                      .join("")}
                                 </ul>`;
        } else {
          colorElem = `<div class="avatar-xxs mb-3 d-none">
                                    <div class="avatar-title bg-light text-muted rounded cursor-pointer">
                                        <i class="ri-error-warning-line"></i>
                                    </div>
                                </div>`;
        }

        var text = datas[i].discount;
        var myArray = text.split("%");
        var discount = myArray[0];
        var afterDiscount = datas[i].price - (datas[i].price * discount) / 100;
        var afterDiscountElem =
          discount > 0
            ? `<h5 class="mb-0">$${afterDiscount.toFixed(
                2
              )} <span class="text-muted fs-12"><del>$${
                datas[i].price
              }</del></span></h5>`
            : `<h5 class="mb-0">$${datas[i].price}</h5>`;

        var layout = document.getElementById("col-3-layout")
          ? '<div class="col-xxl-3 col-lg-4 col-md-6">'
          : '<div class="col-lg-4 col-md-6">';

        document.getElementById("product-grid-right").innerHTML += `${layout}
                          <div class="card overflow-hidden element-item">
                              <div class="bg-light py-4">
                                  <div class="gallery-product">
                                      <img src="${
                                        datas[i].productImg
                                      }" alt="" style="max-height: 215px;max-width: 100%;" class="mx-auto d-block">
                                  </div>
                                  ${productLabel}
                                  <div class="gallery-product-actions">
                                      <div class="mb-2">
                                          <button type="button" class="btn btn-danger btn-sm custom-toggle ${checkinput}" data-bs-toggle="button">
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
                                  <div class="product-btn px-3 add-cart-btn" id="${
                                    datas[i]._id
                                  }">
                                      <a href="#!" class="btn btn-primary btn-sm w-75 add-btn"><i class="mdi mdi-cart me-1"></i> Add to Cart</a>
                                  </div>
                              </div>
                              <div class="card-body">
                                  <div>
                                      ${colorElem ? colorElem : "same as pic"}
                                      <a href="#!">
                                          <h6 class="fs-16 lh-base text-truncate mb-0">${
                                            datas[i].productTitle
                                          }</h6>
                                      </a>
                                      <div class="mt-3">
                                          <span class="float-end">${
                                            datas[i].rating
                                              ? datas[i].rating
                                              : ""
                                          } <i class="ri-star-half-fill text-warning align-bottom"></i></span>
                                          ${afterDiscountElem}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>`;
                      console.log(datas[i]._id)
      }
    }
  }

  selectedPage();
  currentPage == 1
    ? prevButton.parentNode.classList.add("disabled")
    : prevButton.parentNode.classList.remove("disabled");
  currentPage == pages
    ? nextButton.parentNode.classList.add("disabled")
    : nextButton.parentNode.classList.remove("disabled");
}

// Add to cart and redirect if there is no access token
async function addToCart(productId) {
  console.log(productId);
  try {
    const response = await fetch(`http://127.0.0.1:2500/cart/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Replace accessaccessToken with your actual access accessToken
      },
    });

    const data = await response.json();
    if (data.ok) {
        getCartItem()
      console.log("Item saved for later",data);
      // Handle success, if needed
    }else{
        console.log(data)
        alert(data.message)
    }
   
  } catch (error) {
    console.log("Error:", error);
  }
}
function redirectToLoginIfNoaccessToken() {
  if (!accessToken) {
    const path = window.location.pathname;
    const pageName = path.split("/").pop();
    sessionStorage.setItem("lastPage", pageName);
    window.location.href = "/login"; // Redirect to the login page;
  }
  console.log("No acess token here please", accessToken);
}
document.body.addEventListener("click", (e) => {
  // Check if the clicked element or its parent has the 'add-cart-btn' class
  if (
    e.target.classList.contains("add-cart-btn") ||
    e.target.parentElement.classList.contains("add-cart-btn")
  ) {
    // Get the ID of the clicked element
    const productId = e.target.closest(".add-cart-btn").id;
    // Check if there is an access token
    if (!accessToken) {
      redirectToLoginIfNoaccessToken();
    } else {
      addToCart(productId);
    }
  }else{
    //Handle if the add as favourite button is clicked
  }
});

function selectedPage() {
  var pagenumLink = document
    .getElementById("page-num")
    .getElementsByClassName("clickPageNumber");
  for (var i = 0; i < pagenumLink.length; i++) {
    if (i == currentPage - 1) {
      pagenumLink[i].parentNode.classList.add("active");
    } else {
      pagenumLink[i].parentNode.classList.remove("active");
    }
  }
}

// paginationEvents
function paginationEvents() {
  var numPages = function numPages() {
    return Math.ceil(productListData.length / itemsPerPage);
  };

  function clickPage() {
    document.addEventListener("click", function (e) {
      if (
        e.target.nodeName == "A" &&
        e.target.classList.contains("clickPageNumber")
      ) {
        currentPage = e.target.textContent;
        loadProductList(productListData, currentPage);
      }
    });
  }

  function pageNumbers() {
    var pageNumber = document.getElementById("page-num");
    pageNumber.innerHTML = "";
    // for each page
    for (var i = 1; i < numPages() + 1; i++) {
      pageNumber.innerHTML +=
        "<div class='page-item'><a class='page-link clickPageNumber' href='javascript:void(0);'>" +
        i +
        "</a></div>";
    }
  }

  prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      loadProductList(productListData, currentPage);
    }
  });

  nextButton.addEventListener("click", function () {
    if (currentPage < numPages()) {
      currentPage++;
      loadProductList(productListData, currentPage);
    }
  });

  pageNumbers();
  clickPage();
  selectedPage();
}

function searchResult(data) {
  if (data.length == 0) {
    document.getElementById("pagination-element").style.display = "none";
    document.getElementById("search-result-elem").classList.remove("d-none");
  } else {
    document.getElementById("pagination-element").style.display = "flex";
    document.getElementById("search-result-elem").classList.add("d-none");
  }

  var pageNumber = document.getElementById("page-num");
  pageNumber.innerHTML = "";
  var dataPageNum = Math.ceil(data.length / itemsPerPage);
  // for each page
  for (var i = 1; i < dataPageNum + 1; i++) {
    pageNumber.innerHTML +=
      "<div class='page-item'><a class='page-link clickPageNumber' href='javascript:void(0);'>" +
      i +
      "</a></div>";
  }
}

//  category list filter
Array.from(document.querySelectorAll(".filter-list a")).forEach(function (
  filteritem
) {
  filteritem.addEventListener("click", function () {
    var filterListItem = document.querySelector(".filter-list a.active");
    if (filterListItem) filterListItem.classList.remove("active");
    filteritem.classList.add("active");

    var filterItemValue = filteritem.querySelector(".listname").innerHTML;
    var filterData = productListData.filter(
      (filterlist) => filterlist.category === filterItemValue
    );

    searchResult(filterData);
    loadProductList(filterData, currentPage);
  });
});
// Define the filter function separately
function filterItems(arr, query) {
  return arr.filter(function (el) {
    return el.productTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
}
// Search product list
var searchProductList = document.getElementById("searchProductList");
searchProductList.addEventListener("keyup", function () {
  var inputVal = searchProductList.value.trim().toLowerCase(); // Trim input value
  var filterData;

  if (inputVal !== "") {
    filterData = filterItems(productListData, inputVal);
  } else {
    // If input is empty, show all products
    filterData = productListData;
  }

  searchResult(filterData); // Update search result display
  loadProductList(filterData, currentPage); // Update product list display
});

// price range slider
var slider = document.getElementById("product-price-range");
if (slider) {
  noUiSlider.create(slider, {
    start: [0, 2000], // Handle start position
    step: 10, // Slider moves in increments of '10'
    margin: 20, // Handles must be more than '20' apart
    connect: true, // Display a colored bar between the handles
    behaviour: "tap-drag", // Move handle on tap, bar is draggable
    range: {
      // Slider can select '0' to '100'
      min: 0,
      max: 2000,
    },
    format: wNumb({ decimals: 0, prefix: "$ " }),
  });

  var minCostInput = document.getElementById("minCost"),
    maxCostInput = document.getElementById("maxCost");

  var filterDataAll = "";

  // When the slider value changes, update the input and span
  slider.noUiSlider.on("update", function (values, handle) {
    var productListupdatedAll = productListData;

    if (handle) {
      maxCostInput.value = values[handle];
    } else {
      minCostInput.value = values[handle];
    }

    var maxvalue = maxCostInput.value.substr(2);
    var minvalue = minCostInput.value.substr(2);
    filterDataAll = productListupdatedAll.filter(
      (product) =>
        parseFloat(product.price) >= minvalue &&
        parseFloat(product.price) <= maxvalue
    );

    searchResult(filterDataAll);
    loadProductList(filterDataAll, currentPage);
  });

  minCostInput.addEventListener("change", function () {
    slider.noUiSlider.set([null, this.value]);
  });

  maxCostInput.addEventListener("change", function () {
    slider.noUiSlider.set([null, this.value]);
  });
}

// discount-filter
var arraylist = [];
document
  .querySelectorAll("#discount-filter .form-check")
  .forEach(function (item) {
    var inputVal = item.querySelector(".form-check-input").value;
    item
      .querySelector(".form-check-input")
      .addEventListener("change", function () {
        if (item.querySelector(".form-check-input").checked) {
          arraylist.push(inputVal);
        } else {
          arraylist.splice(arraylist.indexOf(inputVal), 1);
        }

        var filterproductdata = productListData;
        if (item.querySelector(".form-check-input").checked && inputVal == 0) {
          filterDataAll = filterproductdata.filter(function (product) {
            if (product.discount) {
              var listArray = product.discount.split("%");

              return parseFloat(listArray[0]) < 10;
            }
          });
        } else if (
          item.querySelector(".form-check-input").checked &&
          arraylist.length > 0
        ) {
          var compareval = Math.min.apply(Math, arraylist);
          filterDataAll = filterproductdata.filter(function (product) {
            if (product.discount) {
              var listArray = product.discount.split("%");
              return parseFloat(listArray[0]) >= compareval;
            }
          });
        } else {
          filterDataAll = productListData;
        }

        searchResult(filterDataAll);
        loadProductList(filterDataAll, currentPage);
      });
  });

// rating-filter
document
  .querySelectorAll("#rating-filter .form-check")
  .forEach(function (item) {
    var inputVal = item.querySelector(".form-check-input").value;
    item
      .querySelector(".form-check-input")
      .addEventListener("change", function () {
        if (item.querySelector(".form-check-input").checked) {
          arraylist.push(inputVal);
        } else {
          arraylist.splice(arraylist.indexOf(inputVal), 1);
        }

        var filterproductdata = productListData;
        if (item.querySelector(".form-check-input").checked && inputVal == 1) {
          filterDataAll = filterproductdata.filter(function (product) {
            if (product.rating) {
              var listArray = product.rating;
              return parseFloat(listArray) == 1;
            }
          });
        } else if (
          item.querySelector(".form-check-input").checked &&
          arraylist.length > 0
        ) {
          var compareval = Math.min.apply(Math, arraylist);
          filterDataAll = filterproductdata.filter(function (product) {
            if (product.rating) {
              var listArray = product.rating;
              return parseFloat(listArray) >= compareval;
            }
          });
        } else {
          filterDataAll = productListData;
        }

        searchResult(filterDataAll);
        loadProductList(filterDataAll, currentPage);
      });
  });

// color-filter
document.querySelectorAll("#color-filter li").forEach(function (item) {
  var inputVal = item.querySelector("input[type='radio']").value;
  item
    .querySelector("input[type='radio']")
    .addEventListener("change", function () {
      var filterData = productListData.filter(function (filterlist) {
        if (filterlist.color) {
          return filterlist.color.some(function (g) {
            return g == inputVal;
          });
        }
      });

      searchResult(filterData);
      loadProductList(filterData, currentPage);
    });
});

// size-filter
document.querySelectorAll("#size-filter li").forEach(function (item) {
  var inputVal = item.querySelector("input[type='radio']").value;
  item
    .querySelector("input[type='radio']")
    .addEventListener("change", function () {
      var filterData = productListData.filter(function (filterlist) {
        if (filterlist.size) {
          return filterlist.size.some(function (g) {
            return g == inputVal;
          });
        }
      });

      searchResult(filterData);
      loadProductList(filterData, currentPage);
    });
});

document.getElementById("sort-elem").addEventListener("change", function (e) {
  var inputVal = e.target.value;
  if (inputVal == "low_to_high") {
    sortElementsByAsc();
  } else if (inputVal == "high_to_low") {
    sortElementsByDesc();
  } else if (inputVal == "") {
    sortElementsById();
  }
});

// sort element ascending
function sortElementsByAsc() {
  var list = productListData.sort(function (a, b) {
    var text = a.discount;
    var myArray = text.split("%");
    var discount = myArray[0];
    var x = a.price - (a.price * discount) / 100;

    var text1 = b.discount;
    var myArray1 = text1.split("%");
    var discount = myArray1[0];
    var y = b.price - (b.price * discount) / 100;

    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  loadProductList(list, currentPage);
}

// sort element descending
function sortElementsByDesc() {
  var list = productListData.sort(function (a, b) {
    var text = a.discount;
    var myArray = text.split("%");
    var discount = myArray[0];
    var x = a.price - (a.price * discount) / 100;

    var text1 = b.discount;
    var myArray1 = text1.split("%");
    var discount = myArray1[0];
    var y = b.price - (b.price * discount) / 100;

    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
    return 0;
  });
  loadProductList(list, currentPage);
}

// sort element id
function sortElementsById() {
  var list = productListData.sort(function (a, b) {
    var x = parseInt(a.id);
    var y = parseInt(b.id);

    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  loadProductList(list, currentPage);
}

// no sidebar page

var hidingTooltipSlider = document.getElementById("slider-hide");
if (hidingTooltipSlider) {
  noUiSlider.create(hidingTooltipSlider, {
    range: {
      min: 0,
      max: 2000,
    },
    start: [20, 800],
    tooltips: true,
    connect: true,
    pips: {
      mode: "count",
      values: 5,
      density: 4,
    },
    format: wNumb({ decimals: 2, prefix: "$ " }),
  });

  var minCostInput = document.getElementById("minCost"),
    maxCostInput = document.getElementById("maxCost");

  var filterDataAll = "";

  // When the slider value changes, update the input and span
  hidingTooltipSlider.noUiSlider.on("update", function (values, handle) {
    var productListupdatedAll = productListData;

    if (handle) {
      maxCostInput.value = values[handle];
    } else {
      minCostInput.value = values[handle];
    }

    var maxvalue = maxCostInput.value.substr(2);
    var minvalue = minCostInput.value.substr(2);
    filterDataAll = productListupdatedAll.filter(
      (product) =>
        parseFloat(product.price) >= minvalue &&
        parseFloat(product.price) <= maxvalue
    );

    searchResult(filterDataAll);
    loadProductList(filterDataAll, currentPage);
  });
}

// choices category input
if (document.getElementById("select-category")) {
  var productCategoryInput = new Choices(
    document.getElementById("select-category"),
    {
      searchEnabled: false,
    }
  );

  productCategoryInput.passedElement.element.addEventListener(
    "change",
    function (event) {
      var productCategoryValue = event.detail.value;
      if (event.detail.value) {
        var filterData = productListData.filter(
          (productlist) => productlist.category === productCategoryValue
        );
      } else {
        var filterData = productListData;
      }
      searchResult(filterData);
      loadProductList(filterData, currentPage);
    },
    false
  );
}

// select-rating
if (document.getElementById("select-rating")) {
  var productRatingInput = new Choices(
    document.getElementById("select-rating"),
    {
      searchEnabled: false,
      allowHTML: true,
      delimiter: ",",
      editItems: true,
      maxItemCount: 5,
      removeItemButton: true,
    }
  );

  productRatingInput.passedElement.element.addEventListener(
    "change",
    function (event) {
      var productRatingInputValue = productRatingInput.getValue(true);
      if (event.detail.value == 1) {
        filterDataAll = productListData.filter(function (product) {
          if (product.rating) {
            var listArray = product.rating;
            return parseFloat(listArray) == 1;
          }
        });
      } else if (productRatingInputValue.length > 0) {
        var compareval = Math.min.apply(Math, productRatingInputValue);
        filterDataAll = productListData.filter(function (product) {
          if (product.rating) {
            var listArray = product.rating;
            return parseFloat(listArray) >= compareval;
          }
        });
      } else {
        filterDataAll = productListData;
      }

      searchResult(filterDataAll);
      loadProductList(filterDataAll, currentPage);
    },
    false
  );
}

// select-discount
if (document.getElementById("select-discount")) {
  var productDiscountInput = new Choices(
    document.getElementById("select-discount"),
    {
      searchEnabled: false,
      allowHTML: true,
      delimiter: ",",
      editItems: true,
      maxItemCount: 5,
      removeItemButton: true,
    }
  );

  productDiscountInput.passedElement.element.addEventListener(
    "change",
    function (event) {
      var productDiscountInputValue = productDiscountInput.getValue(true);
      var filterproductdata = productListData;
      if (event.detail.value == 0) {
        filterDataAll = productListData.filter(function (product) {
          if (product.discount) {
            var listArray = product.discount.split("%");
            return parseFloat(listArray[0]) < 10;
          }
        });
      } else if (productDiscountInputValue.length > 0) {
        var compareval = Math.min.apply(Math, productDiscountInputValue);
        filterDataAll = productListData.filter(function (product) {
          if (product.discount) {
            var listArray = product.discount.split("%");
            return parseFloat(listArray[0]) >= compareval;
          }
        });
      } else {
        filterDataAll = productListData;
      }
      searchResult(filterDataAll);
      loadProductList(filterDataAll, currentPage);
    },
    false
  );
}




