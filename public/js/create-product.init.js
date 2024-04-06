/*
Template Name: Toner eCommerce + Admin HTML Template
Author: Themesbrand
Version: 1.2.0
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Create Product init File
*/

const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");

if (token && username) {
  // document.getElementById("loginContainer").style.display = "none";
  // document.getElementById("username").innerHTML = username.split("@")[0];
}



const setItem = async function (data) {
  console.log(data);
  try {
      // Define headers for the fetch request
      const headers = {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`, // Assuming token is defined somewhere
              // "Content-Type": "application/json",
          },
          body: data,
          mode: "cors",
      };
      // Make a POST request using fetch
      const response = await fetch(`http://127.0.0.1:2500/items`, headers);
      // Check if the response is okay (status code 2xx)
      if (response.ok) {
          // Handle success if needed
          console.log(response);
      }
  } catch (error) {
      // Handle errors that occur during the fetch request
      console.error("Error during creation:", error);
  }
};
async function updateItem(data) {
  try {
    const headers = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      body: data,
      mode: "cors",
    };
    const newItem = await fetch(`http://127.0.0.1:2500/items`, headers);
    if (newItem.ok) {
      const item = await newItem.json();
      console.log(item);
    }    
  } catch (error) {
    console.log(error);
  }
}



ClassicEditor
.create(document.querySelector('#ckeditor-classic'))
.then(function (editor) {
  editor.ui.view.editable.element.style.height = '200px';
})
.catch(function (error) {
  console.error(error);
});

var thumbnailArray = [];

//Initialized a variable to hold the file data when its inserted into the dropzone
let fileInput;
// Dropzone has been added as a global variable.


var myDropzone = new Dropzone("div.my-dropzone", {
  url: "/file/post",
  addRemoveLinks: true,
  removedfile: function (file) {
      file.previewElement.remove();
      thumbnailArray = [];
  },
  init: function() {
      this.on("addedfile", function(file) {
          // Access the file object here
          console.log("File added:", file);
          // Create a new file object
          var newFile = new File([file.slice(0, file.size)], file.name, { type: file.type });
          // Now you have a new file object containing the name, mimetype, and blob data
          fileInput = newFile
      });
  }
});

myDropzone.on("thumbnail", function (file, dataUrl) {
  thumbnailArray.push(dataUrl);
});






var mockFile = { name: "Existing file!", size: 12345 };

// choices category input
var productCategoryInput = new Choices('#choices-category-input', {
    searchEnabled: false,
});

//This value is taken from the product list page and sent here for edit.
var editinputValueJson = sessionStorage.getItem('editInputValue');
console.log(productCategoryInput,editinputValueJson);
//If there is a data in the edit then set the data as the values of the input boxes available.
if (editinputValueJson) {
    var editinputValueJson = JSON.parse(editinputValueJson);
    document.getElementById("formAction").value = "edit";
    document.getElementById("product-id-input").value = editinputValueJson.id;
    productCategoryInput.setChoiceByValue(editinputValueJson.category);
    myDropzone.options.addedfile.call(myDropzone, mockFile);
    myDropzone.options.thumbnail.call(myDropzone, mockFile, editinputValueJson.productImg);
    thumbnailArray.push(editinputValueJson.productImg)
    document.getElementById("product-title-input").value = editinputValueJson.productTitle;
    document.getElementById("stocks-input").value = editinputValueJson.stock;
    document.getElementById("product-price-input").value = editinputValueJson.price;
    document.getElementById("product-discount-input").value = editinputValueJson.discount;
    document.getElementById("orders-input").value = editinputValueJson.orders;
    
    // clothe-colors
    Array.from(document.querySelectorAll(".clothe-colors li")).forEach(function (subElem) {
        var nameelem = subElem.querySelector('[type="checkbox"]');
        editinputValueJson.color.map(function(subItem){
            if (subItem == nameelem.value) {
                nameelem.setAttribute("checked", "checked");
            }
        })
    })

    // clothe-size
    Array.from(document.querySelectorAll(".clothe-size li")).forEach(function (subElem) {
        var nameelem = subElem.querySelector('[type="checkbox"]');
        if(editinputValueJson.size){
            editinputValueJson.size.map(function(subItem){
                if (subItem == nameelem.value) {
                    nameelem.setAttribute("checked", "checked");
                }
            })
        }
    })
}

var forms = document.querySelectorAll('.needs-validation')
// date & time
var date = new Date().toUTCString().slice(5, 16);


var colorsArray = [];
var sizesArray = [];

window.addEventListener('DOMContentLoaded',(e)=>{


  



  fileInput = document.querySelectorAll('input')[8]
//   console.log(fileInput);  
  const formData = new FormData();
  //Check the form action if its add or another thing
console.log(document.getElementById("formAction").value);
//Sending form to backend.
Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            var productTitleValue = document.getElementById("product-title-input").value;
            var productCategoryValue = productCategoryInput.getValue(true);
            var stockInputValue = document.getElementById("stocks-input").value;
            var orderValue = document.getElementById("orders-input").value;
            var productPriceValue = document.getElementById("product-price-input").value;
            var productDiscountVal = document.getElementById("product-discount-input").value;

            // clothe-colors
            document.querySelectorAll(".clothe-colors li").forEach(function (item) {
                if (item.querySelector("input").checked == true) {
                    var colorListVal = item.querySelector("input").value;
                    colorsArray.push(colorListVal)
                }
            });

            // clothe-size
            document.querySelectorAll(".clothe-size li").forEach(function (item) {
                if (item.querySelector("input").checked == true) {
                    var sizeListVal = item.querySelector("input").value;
                    sizesArray.push(sizeListVal)
                }
            });

            var formAction = document.getElementById("formAction").value;
            //If the form action is add, create a new item and save it to the database
            if (formAction == "add" && productCategoryValue !== "" && thumbnailArray.length > 0) {
                //if there is an input value update the value
                if (sessionStorage.getItem('inputValue') != null) {
                  //Update an existing value
                    var inputValueJson = JSON.parse(sessionStorage.getItem('inputValue'));
                    var newObj = {
                        "files": thumbnailArray[0],
                        "productTitle": productTitleValue,
                        "category": productCategoryValue,
                        "price": productPriceValue,
                        "discount": productDiscountVal,
                        "rating": "--",
                        "color": colorsArray,
                        "size": sizesArray,
                        "stock": stockInputValue,
                        "orders": orderValue,
                        "publish": date,
                    };
                    formData.append('files',fileInput);
                    formData.append('productTitle',productCategoryValue);
                    formData.append('category',productCategoryValue);
                    formData.append('price',productPriceValue);
                    formData.append('discount',productDiscountVal);
                    formData.append('color',colorsArray);
                    formData.append('size',sizesArray);
                    formData.append('stock',stockInputValue);
                    formData.append('orders',orderValue);
                    formData.append('publish',date);
                    console.log(document.querySelectorAll('input')[8].files);

                    //This inputValueJson holds all the newly created data
                    inputValueJson.push(newObj);
                    sessionStorage.setItem('inputValue', JSON.stringify(inputValueJson));
                    // console.log(newObj);
                    setItem(formData);
                //If there is no input value
                } else {
                    var inputValueJson = [];
                    var newObj = {
                        "productImg": thumbnailArray[0],
                        "productTitle": productTitleValue,
                        "category": productCategoryValue,
                        "price": productPriceValue,
                        "discount": productDiscountVal,
                        "rating": "--",
                        "color": colorsArray,
                        "size": sizesArray,
                        "stock": stockInputValue,
                        "orders": orderValue,
                        "publish": date,
                    };
                    formData.append('files',fileInput);
                    formData.append('productTitle',productCategoryValue);
                    formData.append('category',productCategoryValue);
                    formData.append('price',productPriceValue);
                    formData.append('discount',productDiscountVal);
                    formData.append('color',colorsArray);
                    formData.append('size',sizesArray);
                    formData.append('stock',stockInputValue);
                    formData.append('orders',orderValue);
                    formData.append('publish',date);
                    setItem(formData);
                    console.log(document.querySelectorAll('input')[8].files);
                    inputValueJson.push(newObj);
                    //Create a new item and store it into the session
                    // sessionStorage.setItem('inputValue', JSON.stringify(inputValueJson));
                    //Create a new item
                }
                // window.location.replace("product-list.html");
            //If the form action is edit, then update an existing item and save it to the database
            }else if (formAction == "edit" && productCategoryValue !== "" && thumbnailArray.length > 0) {
                var editproductId = document.getElementById("product-id-input").value;
                if (sessionStorage.getItem('editInputValue')) {
                    var editObj = {
                        "id": parseInt(editproductId),
                        "productImg": thumbnailArray[0],
                        "productTitle": productTitleValue,
                        "category": productCategoryValue,
                        "price": productPriceValue,
                        "discount": productDiscountVal,
                        "rating": editinputValueJson.rating,
                        "color": colorsArray,
                        "size": sizesArray,
                        "stock": stockInputValue,
                        "orders": orderValue,
                        "publish": editinputValueJson.publish,
                    };
                    formData.append('files',fileInput);
                    formData.append('productTitle',productCategoryValue);
                    formData.append('category',productCategoryValue);
                    formData.append('price',productPriceValue);
                    formData.append('discount',productDiscountVal);
                    formData.append('color',colorsArray);
                    formData.append('size',sizesArray);
                    formData.append('stock',stockInputValue);
                    formData.append('orders',orderValue);
                    formData.append('publish',date);
                    // sessionStorage.setItem('editInputValue', JSON.stringify(editObj));
                    updateItem(newObj);
                    console.log(sessionStorage.getItem('editInputValue'));
                }
                // window.location.replace("product-list.html");
            }else {
                console.log('Form Action Not Found.');
            }

            return false;
        }

        form.classList.add('was-validated');

    }, false)
});


console.log(fileInput);

})

