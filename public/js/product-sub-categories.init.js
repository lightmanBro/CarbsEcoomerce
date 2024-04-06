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

// Fetch subcategory data from the server
var subCategoriesData = [];


var getSubCategory = async function (jsonurl) {
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
            console.log(data);
            return data;
        }
    } catch (error) {
        console.error("Error fetching brand data:", error);
    }
};

var newSubCategory = async function (jsonurl, data) {
    console.log(data);
    try {
        const headers = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Assuming token is defined somewhere
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            mode: "cors",
        };
        const categoryis = await fetch(jsonurl, headers);
        if (categoryis.status === 200) {
            const data = await categoryis.json();
            // loadcategoryList(data, currentPage);
            console.log(data);
        }
    } catch (error) {
        console.error("Error fetching brand data:", error);
    }
};
var editList = false;
var categoryList
var getSubCategoryData = async function () {
      const data = await getSubCategory("http://127.0.0.1:4000/subcategory");      
        // Transform the data received from the server to match the expected format
        subCategoriesData = data.map(item => ({
            id: item.id,  // Assuming you want to use "_id" as the "id" field
            subcategory: item.title,
            category: item.category,  // You may need to set this based on your requirements
            createby: "Admin",  // You may need to set this based on your requirements
            description: item.description,
        }));
      // product-sub-categories
      if (document.getElementById("product-sub-categories")) {
           categoryList = new gridjs.Grid({
              columns: [
                  {
                      name: 'Id', 
                      width: '80px',
                      data: (function (row) {
                          return gridjs.html(`<div class="fw-medium">${row.id}</div>`);
                      })
                  },
                  {
                      name: 'Subcategory',
                      width: '120px'
                  },
                  {
                      name: 'Category',
                      width: '160px'
                  },
                  {
                      name: 'Createby',
                      width: '60px'
                  },{
                      name: 'Action',
                      width: '80px',
                      data: (function (row) {
                          return gridjs.html('<ul class="hstack gap-2 list-unstyled mb-0">\
                          <li>\
                              <a href="#" class="badge bg-success-subtle text-success edit-btn" data-id="'+ row.id + '" onClick="editCategoryList('+ row.id + ')">Edit</a>\
                          </li>\
                          <li>\
                              <a href="#removeItemModal" data-bs-toggle="modal" class="badge bg-danger-subtle text-danger delete-btn" data-id="'+ row.id + '" onClick="removeItem('+ row.id + ')">Delete</a>\
                          </li>\
                      </ul>');
                      })
                  },
              ],
              sort: true,
              pagination: {
                  limit: 10
              },
              data: subCategoriesData,
          }).render(document.getElementById("product-sub-categories"));
         
      };
    } 
getSubCategoryData();

document.body.addEventListener('click', function (event) {
    console.log(event);
    if (event.target.classList.contains('edit-btn')) {
        // Call your edit function with the id
        var id = event.target.getAttribute('data-id');
        editCategoryList(id);
        console.log(id);
    }else if(event.target.classList.contains('delete-btn')){
        var id = event.target.getAttribute('data-id');
        removeItem(id)
        console.log(id);
    } })

// // Attach click event to a parent element (assuming #product-sub-categories is present in the DOM)
// document.getElementById("product-sub-categories").addEventListener("click", function (event) {
//     // Check if the clicked element is an "Edit" button
//     if (event.target && event.target.matches(".edit-button")) {
//         // Extract the ID from the button's data-id attribute
//         var editId = event.target.getAttribute("data-id");
//         editCategoryList(editId);
//     }
// });


// Search result list
var searchResultList = document.getElementById("searchResultList");
searchResultList.addEventListener("keyup", function () {
    var inputVal = searchResultList.value.toLowerCase();
    function filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.subcategory.toLowerCase().indexOf(query.toLowerCase()) !== -1 || el.category.toLowerCase().indexOf(query.toLowerCase()) !== -1 || el.createby.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    }

    var filterData = filterItems(subCategoriesData, inputVal);

    categoryList.updateConfig({
        data: filterData
    }).forceRender();
});
      
      var cateField = document.getElementById("categorySelect");
      var categoryInput = cateField.value;
      
      var createCategoryForm = document.querySelectorAll(".createCategory-form");
      console.log(createCategoryForm);
      Array.prototype.slice.call(createCategoryForm).forEach(function (form) {
          console.log("form submitted");
          form.addEventListener(
              "submit",
              async function (event) {
                  event.preventDefault();
                  // Prevent form submission if it's not valid
                  if (!form.checkValidity()) {
                      event.preventDefault();
                      event.stopPropagation();
                      form.classList.add("was-validated");
                  } else {
                      event.preventDefault();
                      var subcategoryTitle =
                          document.getElementById("SubcategoryTitle").value;
                      var categoryInputVal = document.getElementById("categorySelect").value;
                      var categoryDesc = document.getElementById("descriptionInput").value;
      
                      // Create a new category object and post it to the server
                      if (
                          subcategoryTitle !== "" &&
                          categoryInputVal !== "" &&
                          categoryDesc !== "" &&
                          !editList
                      ) {
                          var newCategory = {
                              subcategory: subcategoryTitle,
                              category: categoryInputVal,
                              description: categoryDesc,
                          };
                          console.log(newCategory);
      
                          await newSubCategory("http://127.0.0.1:4000/subcategory",
                              { title: subcategoryTitle, category: categoryInputVal, description: categoryDesc }
                          )
                          // Update the local data and re-render the category list
                          subCategoriesData.push(newCategory);
                          console.log(newCategory);
                          categoryList.updateConfig({ data: subCategoriesData }).forceRender();
                          clearVal();
                          form.classList.remove("was-validated");
                      } else if (
                          subcategoryTitle !== "" &&
                          categoryInputVal !== "" &&
                          categoryDesc !== "" &&
                          editList
                      ) {
                          var getEditid = document.getElementById("categoryid-input").value;
      
                          subCategoriesData = subCategoriesData.map(function (item) {
                              if (item.id == getEditid) {
                                  var editObj = {
                                      id: getEditid,
                                      subcategory: subcategoryTitle,
                                      category: categoryInputVal,
                                      createby: item.createby,
                                      description: categoryDesc,
                                  };
                                  console.log(editObj);
                                  return editObj;
                              }
                              return item;
                          });
      
                          categoryList
                              .updateConfig({
                                  data: subCategoriesData,
                              })
                              .forceRender();
                          clearVal();
                          form.classList.remove("was-validated");
                          editList = false;
                      } else {
                          form.classList.add("was-validated");
                      }
                      sortElementsById();
                  }
              },
              false
          );
      });
      
//Edit category
function editCategoryList(elem) {
    console.log("Edit button is clicked");
    var getEditid = elem;
    subCategoriesData = subCategoriesData.map(function (item) {
        console.log(item);
        if (item.id === getEditid) {
            editList = true;
            document.getElementById("addCategoryLabel").innerHTML = "Edit Sub Categories";
            document.getElementById("addNewCategory").innerHTML = "Save";
            document.getElementById("categoryid-input").value = item.id;
            document.getElementById("SubcategoryTitle").value = item.subcategory;
            document.getElementById("descriptionInput").value = item.description;
            categoryInput.setChoiceByValue(item.category);
        }
        return item;
    });
}
      
// removeItem event
function removeItem(elem) {
    console.log("Remove button is clicked")
    var getid = elem;
    document.getElementById("remove-category").addEventListener("click", function () {
        function arrayRemove(arr, value) {
            return arr.filter(function (ele) {
                return ele.id != value;
            });
        }
        var filtered = arrayRemove(subCategoriesData, getid);

        subCategoriesData = filtered;
        categoryList.updateConfig({
            data: subCategoriesData
        }).forceRender();

        document.getElementById("close-removecategoryModal").click();
    });
}
      
//Clear input values
function clearVal() {
    document.getElementById("addCategoryLabel").innerHTML = "Create Sub Categories";
    document.getElementById("addNewCategory").innerHTML = "Add Sub Category";
    document.getElementById('SubcategoryTitle').value = "";
    document.getElementById("descriptionInput").value = "";
    categoryInput.removeActiveItems();
    categoryInput.setChoiceByValue("");
}
