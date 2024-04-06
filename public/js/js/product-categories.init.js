/*
Template Name: Toner eCommerce + Admin HTML Template
Author: Themesbrand
Version: 1.2.0
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: product category init File
*/
const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");
const url = "http://127.0.0.1:4000/category";

// Function to handle new category creation
const newCategory = async function (jsonurl, data) {
    console.log(data);
    try {
        // Define headers for the fetch request
        const headers = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Assuming token is defined somewhere
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            mode: "cors",
        };
        // Make a POST request using fetch
        const response = await fetch(jsonurl, headers);
        // Check if the response is okay (status code 2xx)
        if (response.ok) {
            // Handle success if needed
        }
    } catch (error) {
        // Handle errors that occur during the fetch request
        console.error("Error during creation:", error);
    }
};

// Function to handle new category creation
const updateCategory = async function (jsonurl, data) {
    console.log(data);
    try {
        // Define headers for the fetch request
        const headers = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`, // Assuming token is defined somewhere
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            mode: "cors",
        };
        // Make a POST request using fetch
        const response = await fetch(jsonurl, headers);
        // Check if the response is okay (status code 2xx)
        if (response.ok) {
            // Handle success if needed
            const resp = await response.json();
            getCategory(jsonurl);
            console.log(resp);
        }
    } catch (error) {
        // Handle errors that occur during the fetch request
        console.error("Error during creation:", error);
    }
};
//The container where all the data will be first stored so client action can be performed on it
var categoryListData = [];

var prevButton = document.getElementById("page-prev");
var nextButton = document.getElementById("page-next");
var currentPage = 1;
var itemsPerPage = 9;

var getCategory = async function (jsonurl) {
    try {
        const headers = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Assuming token is defined somewhere
            },
        };
        const categoryis = await fetch(jsonurl, headers);
        if (categoryis.status === 200) {
            const data = await categoryis.json();
            categoryListData = data;
            loadcategoryList(data, currentPage);
            console.log(data)
        }
    } catch (error) {
        console.error("Error fetching brand data:", error);
    }
};
getCategory(url);
// loadcategoryList(categoryListData, currentPage);


paginationEvents();

function loadcategoryList(datas, page) {
    var pages = Math.ceil(datas.length / itemsPerPage);
    if (page < 1) page = 1;
    if (page > pages) page = pages;
    document.getElementById("categories-list").innerHTML = "";
    for (
        var i = (page - 1) * itemsPerPage;
        i < page * itemsPerPage && i < datas.length;
        i++
    ) {
        if (datas[i]) {
            // Array.from(datas).forEach(function (listdata) {
            var showElem = 4;
            var subCategoryElem = datas[i].subCategory;
            var subCategoryHtml = "";
            if (datas[i].subCategory) {
                Array.from(subCategoryElem.slice(0, showElem)).forEach(function (elem) {
                    subCategoryHtml +=
                        '<li><a href="#!" class="text-muted">' + elem + "</a></li>";
                });
            }
            document.getElementById(
                "categories-list"
            ).innerHTML += `<div class="col-xl-4 col-md-6">\
                          <div class="card card-height-100 categrory-widgets overflow-hidden">\
                              <div class="card-body p-4">\
                                  <div class="d-flex align-items-center mb-3">\
                                      <h5 class="flex-grow-1 mb-0"> ${datas[i].title} </h5>\
                                      <ul class="flex-shrink-0 list-unstyled hstack gap-1 mb-0">\
                                          <li><a href="#!" class="badge bg-info-subtle text-info  edit-list" data-edit-id=" ${datas[i]._id} ">Edit</a></li>\
                                          <li><a href="#delteModal" data-bs-toggle="modal" class="badge bg-danger-subtle text-danger  remove-list" data-remove-id=" ${datas[i]._id}  ">Delete</a></li>\
                                      </ul>\
                                  </div>\
                                  <ul class="list-unstyled vstack gap-2 mb-0"> ${subCategoryHtml} </ul>\
                                  <div class="d-none"> ${datas[i].description} </div>\
                                  <div class="mt-3">\
                                      <a data-bs-toggle="offcanvas" href="#overviewOffcanvas"  data-view-id=" ${datas[i]._id}" class="overview-btn fw-medium link-effect">Read More <i class="ri-arrow-right-line align-bottom ms-1"></i></a>\
                                  </div>\
                                  <img src=" ${datas[i].categoryImg} " alt="" class="img-fluid category-img object-fit-cover">\
                              </div>\
                          </div>\
                      </div>`;
        }
    }
    selectedPage();
    currentPage == 1
        ? prevButton.parentNode.classList.add("disabled")
        : prevButton.parentNode.classList.remove("disabled");
    currentPage == pages
        ? nextButton.parentNode.classList.add("disabled")
        : nextButton.parentNode.classList.remove("disabled");
    //   editCategoryList();
    //   removeItem();
    overViewList();

}

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
        return Math.ceil(categoryListData.length / itemsPerPage);
    };

    function clickPage() {
        document.addEventListener("click", function (e) {
            if (
                e.target.nodeName == "A" &&
                e.target.classList.contains("clickPageNumber")
            ) {
                currentPage = e.target.textContent;
                loadcategoryList(categoryListData, currentPage);
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
            loadcategoryList(categoryListData, currentPage);
        }
    });

    nextButton.addEventListener("click", function () {
        if (currentPage < numPages()) {
            currentPage++;
            loadcategoryList(categoryListData, currentPage);
        }
    });

    pageNumbers();
    clickPage();
    selectedPage();
}

// Search product list
var searchInputList = document.getElementById("searchInputList");
searchInputList.addEventListener("keyup", function () {
    var inputVal = searchInputList.value.toLowerCase();
    function filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.categoryTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }
    var filterData = filterItems(categoryListData, inputVal);
    searchResult(filterData);
    loadcategoryList(filterData, currentPage);
});

var editlist = false;

// category image
document
    .querySelector("#category-image-input")
    .addEventListener("change", function () {
        var preview = document.querySelector("#category-img");
        var file = document.querySelector("#category-image-input").files[0];
        var reader = new FileReader();
        reader.addEventListener(
            "load",
            function () {
                preview.src = reader.result;
            },
            false
        );
        if (file) {
            reader.readAsDataURL(file);
        }
    });
let id;//Initialized the id so it can be used for editing
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-list')) {
            // Call your edit function with the id
             id = event.target.getAttribute('data-edit-id');
            editCategoryList(id);
        } else if (event.target.classList.contains('remove-list')) {
             id = event.target.getAttribute('data-remove-id');
            removeItem(id)
            console.log(id);
        } else {
            event.stopPropagation();
        }
    })

var createCategoryForm = document.querySelectorAll(".createCategory-form");
Array.prototype.slice.call(createCategoryForm).forEach(function (form) {
    const actionDeterminingBtn = document.querySelector('#category-submit');
    form.addEventListener(
        "submit",
        function (event) {
                var title = document.getElementById("categoryTitle").value;
                var categoryImg = document.getElementById("category-img").src;
                var description = document.getElementById("descriptionInput").value;
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add("was-validated");
            } else if (form.checkValidity() && actionDeterminingBtn.innerHTML.includes('Add Category')) {
                event.preventDefault();
                var imgArray = window.location.href.split("#");
                //If the innerHTML of the button is Add Category then
                if (title !== "" && categoryImg !== imgArray[0] && !editlist) {
                    var newCate = {
                        categoryImg: categoryImg,
                        categoryTitle: title,
                        subCategory: null,
                        description: description,
                    };
                    newCategory(url, { title, description });
                    categoryListData.push(newCate);
                    searchResult(categoryListData);
                    loadcategoryList(categoryListData, currentPage);
                    clearVal();
                    form.classList.remove("was-validated");
                }
            } else if (form.checkValidity() && actionDeterminingBtn.innerHTML == 'Save') {
                //If the button innerHTML is Save
                if (title !== "") {
                    let _id;
                    getEditid = document.querySelector("form #categoryid-input").value;
                    categoryListData = categoryListData.filter(function (item) {
                        item._id == id                       
                    });

                    console.log(categoryListData,id);
                    updateCategory(url,{_id:id,title,description});
                    //The function to take the update to the backend
                    searchResult(categoryListData);
                    loadcategoryList(categoryListData, currentPage);
                    clearVal();
                    form.classList.remove("was-validated");
                    editlist = false;
                }
            } else {
                form.classList.add("was-validated");
            }
            sortElementsById();
        }
    )
},
    editlist = false
);



function searchResult(data) {
    if (data.length == 0) {
        document.getElementById("pagination-element").style.display = "none";
        // document.getElementById("search-result-elem").classList.remove("d-none");
    } else {
        document.getElementById("pagination-element").style.display = "flex";
        // document.getElementById("search-result-elem").classList.add("d-none");
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

function fetchIdFromObj(category) {
    return parseInt(category.id);
}

function findNextId() {
    if (categoryListData.length === 0) {
        return 0;
    }
    var lastElementId = fetchIdFromObj(
        categoryListData[categoryListData.length - 1]
    ),
        firstElementId = fetchIdFromObj(categoryListData[0]);
    return firstElementId >= lastElementId
        ? firstElementId + 1
        : lastElementId + 1;
}

function sortElementsById() {
    var manyCategory = categoryListData.sort(function (a, b) {
        var x = fetchIdFromObj(a);
        var y = fetchIdFromObj(b);

        if (x > y) {
            return -1;
        }
        if (x < y) {
            return 1;
        }
        return 0;
    });
    loadcategoryList(manyCategory, currentPage);
}
sortElementsById();


function setEditValues(item) {
    document.querySelector("form #descriptionInput").value = item.description;
    document.querySelector("form #categoryTitle").value = item.title;
    document.querySelector("form #categoryid-input").value = item.id;
    document.querySelector('#category-submit').innerHTML = 'Save';
}

// editCategoryList
function editCategoryList(getEditid) {
    categoryListData = categoryListData.map(function (item) {
        item._id == getEditid.trim() ? setEditValues(item) : "";
        console.log(item._id === getEditid.trim(), typeof (item._id), typeof (getEditid), item._id, getEditid.trim());
        return item;
    });
    //   console.log(categoryListData);
}

// overViewList
function overViewList() {
    var getViewid = 0;
    Array.from(document.querySelectorAll(".overview-btn")).forEach(function (
        elem
    ) {
        elem.addEventListener("click", function (event) {
            getViewid = elem.getAttribute("data-view-id");
            categoryListData = categoryListData.map(function (item) {
                if (item.id == getViewid) {
                    document.querySelector("#overviewOffcanvas .overview-id").innerHTML =
                        item.id;
                    document.querySelector("#overviewOffcanvas .overview-img").src =
                        item.categoryImg;
                    document.querySelector(
                        "#overviewOffcanvas .overview-title"
                    ).innerHTML = item.categoryTitle;
                    document.querySelector(
                        "#overviewOffcanvas .overview-desc"
                    ).innerHTML = item.description;
                    document.querySelector("#overviewOffcanvas .subCategory").innerHTML =
                        "";
                    item.subCategory.map(function (subItem) {
                        document.querySelector(
                            "#overviewOffcanvas .subCategory"
                        ).innerHTML +=
                            '<li><a href="#!" class="text-reset">' + subItem + "</a></li>";
                    });

                    document
                        .querySelector("#overviewOffcanvas .edit-list")
                        .setAttribute("data-edit-id", getViewid);
                    document
                        .querySelector("#overviewOffcanvas .remove-list")
                        .setAttribute("data-remove-id", getViewid);
                }

                return item;
            });
        });
    });
}

// removeItem
function removeItem(getid) {
    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele.id != value;
        });
    }
    var filtered = arrayRemove(categoryListData, getid);
    categoryListData = filtered;
    searchResult(categoryListData);
    loadcategoryList(categoryListData, currentPage);
    document.getElementById("close-removecategoryModal").click();
}

function clearVal() {
    document.getElementById("categoryTitle").value = "";
    document.getElementById("category-img").src = "";
    document.getElementById("slugInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("category-image-input").value = "";
}
