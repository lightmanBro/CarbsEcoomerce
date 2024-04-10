/*
Template Name: Toner eCommerce + Admin HTML Template
Author: Themesbrand
Version: 1.2.0
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: menu Js File
*/
if (token && username) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("username").innerHTML = username.split("@")[0];
  }

  
var default_lang = "en"; // set Default Language
var language = localStorage.getItem("language");

function initLanguage() {
    // Set new language
    (language === null) ? setLanguage(default_lang) : setLanguage(language);
    var languages = document.getElementsByClassName("language");
    languages && Array.from(languages).forEach(function (dropdown) {
        dropdown.addEventListener("click", function (event) {
            setLanguage(dropdown.getAttribute("data-lang"));
        });
    });
}

function setLanguage(lang) {
    if (document.getElementById("header-lang-img")) {
        if (lang == "en") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/us.svg";
            document.getElementById("lang-name").innerHTML = "English"
        } else if (lang == "sp") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/spain.svg";
            document.getElementById("lang-name").innerHTML = "Española"
        } else if (lang == "gr") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/germany.svg";
            document.getElementById("lang-name").innerHTML = "Deutsche"
        } else if (lang == "it") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/italy.svg";
            document.getElementById("lang-name").innerHTML = "Italiana"
        } else if (lang == "ru") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/russia.svg";
            document.getElementById("lang-name").innerHTML = "русский"
        } else if (lang == "ch") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/china.svg";
            document.getElementById("lang-name").innerHTML = "中国人"
        } else if (lang == "fr") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/french.svg";
            document.getElementById("lang-name").innerHTML = "français"
        } else if (lang == "sa") {
            document.getElementById("header-lang-img").src = "../assets/images/flags/sa.svg";
            document.getElementById("lang-name").innerHTML = "عربى"
        }
        localStorage.setItem("language", lang);
        language = localStorage.getItem("language");
        getLanguage();
    }
}

// Multi language setting
function getLanguage() {
    language == null ? setLanguage(default_lang) : false;
    var request = new XMLHttpRequest();
    // Instantiating the request object
    request.open("GET", "../assets/lang/" + language + ".json");
    // Defining event listener for readystatechange event
    request.onreadystatechange = function () {
        // Check if the request is compete and was successful
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);
            Object.keys(data).forEach(function (key) {
                var elements = document.querySelectorAll("[data-key='" + key + "']");
                Array.from(elements).forEach(function (elem) {
                    elem.textContent = data[key];
                });
            });
        }
    };
    // Sending the request to the server
    request.send();
}

initLanguage();

//  Search menu dropdown on Topbar
function isCustomDropdown() {
    //Search bar
    var searchOptions = document.getElementById("search-close-options");
    var dropdown = document.getElementById("search-dropdown");
    var searchInput = document.getElementById("search-options");
    if (searchInput) {
        searchInput.addEventListener("focus", function () {
            var inputLength = searchInput.value.length;
            if (inputLength > 0) {
                dropdown.classList.add("show");
                searchOptions.classList.remove("d-none");
            } else {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });

        searchInput.addEventListener("keyup", function (event) {
            var inputLength = searchInput.value.length;
            if (inputLength > 0) {
                dropdown.classList.add("show");
                searchOptions.classList.remove("d-none");

                var inputVal = searchInput.value.toLowerCase();
                var notifyItem = document.getElementsByClassName("notify-item");

                Array.from(notifyItem).forEach(function (element) {
                    var notifiTxt = ''
                    if (element.querySelector("h6")) {
                        var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
                        var name = element.querySelector("h6").innerText.toLowerCase()
                        if (name.includes(inputVal)) {
                            notifiTxt = name
                        } else {
                            notifiTxt = spantext
                        }
                    } else if (element.getElementsByTagName("span")) {
                        notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
                    }

                    if (notifiTxt) {
                        if (notifiTxt.includes(inputVal)) {
                            element.classList.add("d-block");
                            element.classList.remove("d-none");
                        } else {
                            element.classList.remove("d-block");
                            element.classList.add("d-none");
                        }
                    }

                    Array.from(document.getElementsByClassName("notification-group-list")).forEach(function (element) {
                        if (element.querySelectorAll(".notify-item.d-block").length == 0) {
                            element.querySelector(".notification-title").style.display = 'none'
                        } else {
                            element.querySelector(".notification-title").style.display = 'block'
                        }
                    });
                });
            } else {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });

        searchOptions.addEventListener("click", function () {
            searchInput.value = "";
            dropdown.classList.remove("show");
            searchOptions.classList.add("d-none");
        });

        document.body.addEventListener("click", function (e) {
            if (e.target.getAttribute("id") !== "search-options") {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });
    }

    // cart dropdown

        // input spin
        isData();
        function isData() {
            var plus = document.getElementsByClassName('plus');
            var minus = document.getElementsByClassName('minus');
            var product = document.getElementsByClassName("product");

            if (plus) {
                Array.from(plus).forEach(function (e) {
                    e.addEventListener('click', function (event) {
                        // if(event.target.previousElementSibling.value )
                        if (parseInt(e.previousElementSibling.value) < event.target.previousElementSibling.getAttribute('max')) {
                            event.target.previousElementSibling.value++;
                            if (product) {
                                Array.from(product).forEach(function (x) {
                                    updateQuantity(event.target);
                                })
                            }
                        }
                    });
                });
            }

            if (minus) {
                Array.from(minus).forEach(function (e) {
                    e.addEventListener('click', function (event) {
                        if (parseInt(e.nextElementSibling.value) > event.target.nextElementSibling.getAttribute('min')) {
                            event.target.nextElementSibling.value--;
                            if (product) {
                                Array.from(product).forEach(function (x) {
                                    updateQuantity(event.target);
                                })
                            }
                        }
                    });
                });
            }
        }

        var taxRate = 0.125;
        var shippingRate = 65.00;
        var discountRate = 0.15;

        var currencySign = "$";
        var cartList = document.querySelectorAll(".cartlist li").length;
        document.querySelectorAll(".cartitem-badge").forEach(function(item){
            item.innerHTML = cartList
        })

        document.querySelectorAll(".product-list").forEach(function(elem){
            elem.querySelectorAll(".product-count").forEach(function(subelem){
                subelem.innerHTML = elem.querySelectorAll(".product").length
            })
            recalculateCart(elem);
        })

        function recalculateCart(elm) {
            var subtotal = 0;

            Array.from(elm.getElementsByClassName("product")).forEach(function (item) {
                Array.from(item.getElementsByClassName('product-line-price')).forEach(function (e) {
                    subtotal += parseFloat(e.innerHTML);
                });
            });

            /* Calculate totals */
            var tax = subtotal * taxRate;
            var discount = subtotal * discountRate;

            var shipping = (subtotal > 0 ? shippingRate : 0);
            var total = subtotal + tax + shipping - discount;

            elm.querySelector(".cart-subtotal").innerHTML = currencySign + subtotal.toFixed(2);
            elm.querySelector(".cart-tax").innerHTML = currencySign + tax.toFixed(2);
            elm.querySelector(".cart-shipping").innerHTML = currencySign + shipping.toFixed(2);
            elm.querySelector(".cart-total").innerHTML = currencySign + total.toFixed(2);
            elm.querySelector(".cart-discount").innerHTML = "-" + currencySign + discount.toFixed(2);
        }

        function updateQuantity(quantityInput) {
            if(quantityInput.closest('.product')){
                var productRow = quantityInput.closest('.product');
            var productList = quantityInput.closest('.product-list');
            var price;
            if (productRow || productRow.getElementsByClassName('product-price'))
                Array.from(productRow.getElementsByClassName('product-price')).forEach(function (e) {
                    price = parseFloat(e.innerHTML);
                });

            if (quantityInput.previousElementSibling && quantityInput.previousElementSibling.classList.contains("product-quantity")) {
                var quantity = quantityInput.previousElementSibling.value;
            } else if (quantityInput.nextElementSibling && quantityInput.nextElementSibling.classList.contains("product-quantity")) {
                var quantity = quantityInput.nextElementSibling.value;
            }
            var linePrice = price * quantity;
            /* Update line price display and recalc cart totals */
            Array.from(productRow.getElementsByClassName('product-line-price')).forEach(function (e) {
                e.innerHTML = linePrice.toFixed(2);
                recalculateCart(productList);
            });
            }
        }

        // Remove product from cart
        var removeProduct = document.getElementById('removeItemModal')
        if (removeProduct)
        removeProduct.addEventListener('show.bs.modal', function (e) {
            document.getElementById('remove-product').addEventListener('click', function (event) {
                e.relatedTarget.closest('.product').remove();

                document.getElementById("close-modal").click();
                document.querySelectorAll(".cartitem-badge").forEach(function(item){
                    item.innerHTML = document.querySelectorAll(".cartlist li").length;
                })

                document.querySelectorAll(".product-list").forEach(function(elem){
                    elem.querySelectorAll(".product-count").forEach(function(subelem){
                        subelem.innerHTML = elem.querySelectorAll(".product").length
                    })
                    recalculateCart(elem);
                })
            });
        });
}
//  search menu dropdown on topbar
function isCustomDropdownResponsive() {
    //Search bar
    var searchOptions = document.getElementById("search-close-options");
    var dropdownReponsive = document.getElementById("search-dropdown-reponsive");
    var searchInputReponsive = document.getElementById("search-options-reponsive");

    if (searchOptions && dropdownReponsive && searchInputReponsive) {
        searchInputReponsive.addEventListener("focus", function () {
            var inputLength = searchInputReponsive.value.length;
            if (inputLength > 0) {
                dropdownReponsive.classList.add("show");
                searchOptions.classList.remove("d-none");
            } else {
                dropdownReponsive.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });

        searchInputReponsive.addEventListener("keyup", function () {
            var inputLength = searchInputReponsive.value.length;
            if (inputLength > 0) {
                dropdownReponsive.classList.add("show");
                searchOptions.classList.remove("d-none");
            } else {
                dropdownReponsive.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });

        searchOptions.addEventListener("click", function () {
            searchInputReponsive.value = "";
            dropdownReponsive.classList.remove("show");
            searchOptions.classList.add("d-none");
        });

        document.body.addEventListener("click", function (e) {
            if (e.target.getAttribute("id") !== "search-options") {
                dropdownReponsive.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });
    }
}

function elementInViewport(el) {
    if (el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        if (el.offsetParent) {
            while (el.offsetParent) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;
            }
        }
        return (
            top >= window.pageYOffset &&
            left >= window.pageXOffset &&
            top + height <= window.pageYOffset + window.innerHeight &&
            left + width <= window.pageXOffset + window.innerWidth
        );
    }
}

function windowResizeHover() {
    var isElement = document.querySelectorAll(".ecommerce-navbar .navbar-nav li");
    Array.from(isElement).forEach(function (item) {
        item.addEventListener("click", menuItem.bind(this), false);
        item.addEventListener("mouseover", menuItem.bind(this), false);
    });

    var windowSize = document.documentElement.clientWidth;
    if (windowSize < 992) {
        var currentPath = location.pathname == "/" ? "index.html" : location.pathname.substring(1);
        currentPath = currentPath.substring(currentPath.lastIndexOf("/") + 1);

        if (currentPath) {
            var a = document.getElementById("navigation-menu").querySelector('[href="' + currentPath + '"]');
            if (a) {
                var parentCollapseDiv = a.closest(".dropdown-menu");

                if (parentCollapseDiv) {
                    parentCollapseDiv.classList.add("show");
                    if (parentCollapseDiv.parentElement) {
                        parentCollapseDiv.classList.add("show");
                        parentCollapseDiv.parentElement.children[0].classList.add("show");
                        parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
                        if (parentCollapseDiv.parentElement.parentElement.parentElement) {
                            parentCollapseDiv.parentElement.parentElement.classList.add("show");
                            parentCollapseDiv.parentElement.parentElement.parentElement.children[0].classList.add("show");
                            parentCollapseDiv.parentElement.parentElement.parentElement.children[0].setAttribute("aria-expanded", "true");
                            if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement) {
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.classList.add("show");
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].classList.add("show");
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].setAttribute("aria-expanded", "true");
                                if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement) {
                                    parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add("show");
                                    parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].classList.add("show");
                                    parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].setAttribute("aria-expanded", "true");
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        document.querySelectorAll("#navigation-menu .dropdown").forEach(function (elem) {
            if (elem.querySelector(".dropdown-menu").classList.contains("show")) {
                elem.querySelector(".dropdown-menu").classList.remove("show");
            }
            if (elem.querySelector(".dropdown-toggle")) {
                elem.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false")
            }
        });
    }

    var myCollapse = document.getElementById("navbarSupportedContent");
    var bsCollapse = new bootstrap.Collapse(myCollapse,{
        toggle: false
    })
    bsCollapse.hide();
  
}

window.addEventListener("resize", windowResizeHover);

windowResizeHover();

function menuItem(e) {
    if (e.target && e.target.matches(".submenu a.nav-link")) {
        if (elementInViewport(e.target.nextElementSibling) == false) {
            e.target.nextElementSibling.classList.add("dropdown-custom-right");
            // e.target.parentElement.parentElement.classList.add("dropdown-custom-right");

            var eleChild = e.target.nextElementSibling;
            Array.from(eleChild.querySelectorAll(".submenu")).forEach(function (item) {
                item.classList.add("dropdown-custom-right");
            });
        } else if (elementInViewport(e.target.nextElementSibling) == true) {
            if (window.innerWidth >= 1848) {
                var elements = document.getElementsByClassName("dropdown-custom-right");
                while (elements.length > 0) {
                    elements[0].classList.remove("dropdown-custom-right");
                }
            }
        }
    }
}

function initActiveMenu() {
    var currentPath = location.pathname == "/" ? "index.html" : location.pathname.substring(1);
    currentPath = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    if (currentPath) {
        var a = document.getElementById("navigation-menu").querySelector('.nav-link[href="' + currentPath + '"]');
        if (a) {
            a.classList.add("active");
            var parentCollapseDiv = a.closest(".dropdown-menu");
            if (parentCollapseDiv) {
                if (parentCollapseDiv.parentElement) {
                    parentCollapseDiv.parentElement.children[0].classList.add("active");
                    if (parentCollapseDiv.parentElement.parentElement.parentElement) {
                        parentCollapseDiv.parentElement.parentElement.parentElement.children[0].classList.add("active");
                        if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement) {
                            parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].classList.add("active");
                            if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement) {
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].classList.add("active");
                            }
                        }
                    }
                }
            }
        }
    }
}

function initMenuItemScroll() {
    setTimeout(function () {
        var sidebarMenu = document.getElementById("navbarSupportedContent");
        if (sidebarMenu) {
            if (sidebarMenu.querySelector(".nav-link.active")) {
                var activeMenu = sidebarMenu.querySelector(".nav-link.active").offsetTop;
                setTimeout(function () {
                    sidebarMenu.scrollTop = activeMenu
                }, 0);
                
            }
        }
    }, 250);
}
initMenuItemScroll();

const navbarCollapsible = document.getElementById('navbarSupportedContent')
navbarCollapsible.addEventListener('shown.bs.collapse', event => {
    initMenuItemScroll()
})

function initModeSetting() {
    if (sessionStorage.getItem("data-bs-theme") && sessionStorage.getItem("data-bs-theme") == "light") {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }else if (sessionStorage.getItem("data-bs-theme") == "dark") {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    
    var html = document.getElementsByTagName("HTML")[0];
    document.querySelectorAll("#light-dark-mode .dropdown-item").forEach(function (item) {
        item.addEventListener("click", function (event) {
            if (html.hasAttribute("data-bs-theme") && item.getAttribute("data-mode") == "light") {
                sessionStorage.setItem("data-bs-theme", "light");
            } else if (html.hasAttribute("data-bs-theme") && item.getAttribute("data-mode") == "dark") {
                sessionStorage.setItem("data-bs-theme", "dark");
            } else if (html.hasAttribute("data-bs-theme") && item.getAttribute("data-mode") == "auto") {
                const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
                if (prefersDarkScheme.matches) {
                    sessionStorage.setItem("data-bs-theme", "dark");
                } else {
                    sessionStorage.setItem("data-bs-theme", "light");
                }
            }

            if (sessionStorage.getItem("data-bs-theme") && sessionStorage.getItem("data-bs-theme") == "light") {
                document.documentElement.setAttribute('data-bs-theme', 'light');
            }else if (sessionStorage.getItem("data-bs-theme") == "dark") {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            }
        })
    })
}


function init() {
    isCustomDropdown();
    isCustomDropdownResponsive();
    initActiveMenu();
    initMenuItemScroll();
    initModeSetting();
}
init();


//  Window scroll sticky class add
function windowScroll() {
    var navbar = document.getElementById("navbar");
    if (navbar) {
        if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
            navbar.classList.add("is-sticky");
        } else {
            navbar.classList.remove("is-sticky");
        }
    }
}

window.addEventListener('scroll', function (ev) {
    ev.preventDefault();
    windowScroll();
});

//modal js
function firstTimeLoad() {

    var myModal = new bootstrap.Modal(document.getElementById('subscribeModal'), {
        keyboard: false
    })
    var modalToggle = document.getElementById('subscribeModal') // relatedTarget

    setTimeout(function () {
        myModal ? myModal.show(modalToggle) : "";
    }, 1000);
}

firstTimeLoad();

// var tooltipTriggerList = [].slice.call(
//     document.querySelectorAll('[data-bs-toggle="tooltip"]')
// );
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//     return new bootstrap.Tooltip(tooltipTriggerEl);
// });

function initComponents() {
    // tooltip
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // popover
    var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

initComponents();

setTimeout(function () {
    // === following js will activate the menu in left side bar based on url ====
    var menuItems = document.querySelectorAll(".submenu-item li a");
    menuItems && menuItems.forEach(function (item) {
        var pageUrl = window.location.href.split(/[?#]/)[0];

        if (item.href == pageUrl) {
            item.classList.add("active");
        }
    });
}, 0)

//
/********************* scroll top js ************************/
//

var mybutton = document.getElementById("back-to-top");

if (mybutton) {
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

//chat bot
function chatBot() {
    var chatbot = document.getElementById("chatBot");
    if (chatbot) {
        chatbot.classList.remove("show");
    }
}

// Scroll to Bottom
function scrollToBottom(id) {
	setTimeout(function () {
		var simpleBar = (document.getElementById(id).querySelector("#chat-conversation .simplebar-content-wrapper")) ?
			document.getElementById(id).querySelector("#chat-conversation .simplebar-content-wrapper") : ''

		var offsetHeight = document.getElementsByClassName("chat-conversation-list")[0] ?
			document.getElementById(id).getElementsByClassName("chat-conversation-list")[0].scrollHeight - window.innerHeight + 800 : 0;

		if (offsetHeight)
			simpleBar.scrollTo({
				top: offsetHeight,
				behavior: "smooth"
			});
	}, 100);
}


const chatCollapsible = document.getElementById('chatBot')
chatCollapsible.addEventListener('shown.bs.collapse', event => {
	// chat
	var currentChatId = "users-chat-widget";
	scrollToBottom(currentChatId);
})


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
        // console.log(items);
        const { status, allItems } = items;
        document.getElementById("cartItemLists").innerHTML  =
          allItems.length;
        // console.log(allItems);
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
        //   document.getElementById("cart_checkout_list").innerHTML += cartItems;
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
  
  