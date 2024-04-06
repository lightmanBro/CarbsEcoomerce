//When the page loads the token should be fetched and if its available then it should stay on the page 
//if its not available then it should redirect to the login page.
// const token = sessionStorage.getItem("token");
// const username = sessionStorage.getItem("username");
if(!token){
    window.location.assign('/index');
}

console.log(token,"At init.js");
if (token && username) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("username").innerHTML = username.split("@")[0];
}
window.addEventListener('DOMContentLoaded',(e)=>{

})

//Fixed and working perfectly
async function setAddress(type, details) {
  const data = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, details }),
  };
  const userAddress = await fetch(`http://127.0.0.1:2500/user/address`, data);
  if (userAddress.ok) {
    const addresses = await userAddress.json();
    //Get the list of the address after a new one is set.
    getAddress();
    console.log(addresses);
  }
}

async function updateAddress(type, details) {
    const data = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, details }),
    };
    const userAddress = await fetch(`http://127.0.0.1:2500/user/address`, data);
    if (userAddress.ok) {
      const addresses = await userAddress.json();
      console.log(addresses);
    }
  }

  async function getAddress() {
    const data = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const userAddress = await fetch(`http://127.0.0.1:2500/user/address`, data);
    if (userAddress.ok) {
      const addresses = await userAddress.json();
      (addresses);
      loadAddressList(addresses.address);
    }
  }

  getAddress();

  async function deleteAddress(type){
    console.log(type);
    const data = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({type:type})
      };
      console.log(data.body);
      const userAddress = await fetch(`http://127.0.0.1:2500/user/address`, data);
      if (userAddress.ok) {
        const deleted = await userAddress.text();
        console.log(deleted);
       getAddress();
      }
  }

var editlist = false;

// loadAddressList(addressListData);

function loadAddressList(datas) {
  document.getElementById("address-list").innerHTML = "";
  Array.from(datas).forEach(function (listdata) {
    var checkinput = listdata.checked ? "checked" : "";
    document.getElementById("address-list").innerHTML +=
      '<div class="col-lg-6">\
                              <div>\
                                  <div class="form-check card-radio">\
                                      <input id="shippingAddress' +
      listdata.id +
      '" name="shippingAddress" type="radio" class="form-check-input" ' +
      checkinput +
      '>\
                                      <label class="form-check-label" for="shippingAddress' +
      listdata.state +
      '">\
                                          <span class="mb-4 fw-semibold fs-12 d-block text-muted text-uppercase">' +
      listdata.state +
      ' Address</span>\
                                          <span class="fs-14 mb-2 fw-semibold  d-block">' +
      listdata.name +
      '</span>\
                                          <span class="text-muted fw-normal text-wrap mb-1 d-block">' +
      listdata.address +
      '</span>\
                                          <span class="text-muted fw-normal d-block">Mo. ' +
      listdata.phone +
      '</span>\
                                      </label>\
                                  </div>\
                                  <div class="d-flex flex-wrap p-2 py-1 bg-light rounded-bottom border mt-n1 fs-13">\
                                      <div>\
                                          <a href="#" class="d-block text-body p-1 px-2 edit-list" data-edit-id="' +
      listdata.state +
      '" data-bs-toggle="modal" data-bs-target="#addAddressModal"><i class="ri-pencil-fill text-muted align-bottom me-1"></i> Edit</a>\
                                      </div>\
                                      <div>\
                                          <a href="#" class="d-block text-body p-1 px-2 remove-list" data-remove-id="' +
      listdata.state +
      '" data-bs-toggle="modal" data-bs-target="#removeAddressModal"><i class="ri-delete-bin-fill text-muted align-bottom me-1"></i> Remove</a>\
                                      </div>\
                                  </div>\
                              </div>\
                          </div>';

    editAddressList();
    removeItem();
  });
}

var createAddressForms = document.querySelectorAll(".createAddress-form");
Array.prototype.slice.call(createAddressForms).forEach(function (form) {
  form.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        var inputName = document.getElementById("addaddress-Name").value;
        var addressValue = document.getElementById("addaddress-textarea").value;
        var phoneValue = document.getElementById("addaddress-phone").value;
        var stateValue = document.getElementById("state").value;
        var addressType = document.querySelector(".form-select").value;
        if (
          inputName !== "" &&
          addressValue !== "" &&
          stateValue !== "" &&
          phoneValue !== "" &&
          !editlist
        ) {
          //   var newListId = findNextId();
          const address = {
            name: inputName,
            address: addressValue,
            phone: phoneValue,
            state:stateValue,
            checked: false,
          };
          //Working perfectly
          setAddress(addressType, address);
          //wait for 2 sec then close the modal and clear the input boxes;
          console.log(address);
        } 
      form.classList.add("was-validated");
    }
  
})});

function fetchIdFromObj(list) {
  return parseInt(list._id);
}

// function findNextId() {
//   if (addressListData.length === 0) {
//     return 0;
//   }
//   var lastElementId = fetchIdFromObj(
//       addressListData[addressListData.length - 1]
//     ),
//     firstElementId = fetchIdFromObj(addressListData[0]);
//   return firstElementId >= lastElementId
//     ? firstElementId + 1
//     : lastElementId + 1;
// }

// Array.from(document.querySelectorAll(".addAddress-modal")).forEach(function (
//   elem
// ) {
//   elem.addEventListener("click", function (event) {
//     document.getElementById("addAddressModalLabel").innerHTML =
//       "Add New Address";
//     document.getElementById("addNewAddress").innerHTML = "Add";
//     document.getElementById("addaddress-Name").value = "";
//     document.getElementById("addaddress-textarea").value = "";
//     document.getElementById("addaddress-phone").value = "";
//     document.getElementById("state").value = "Home";

//     document
//       .getElementById("createAddress-form")
//       .classList.remove("was-validated");
//   });
// });

function editAddressList() {
  var getEditid = 0;
  Array.from(document.querySelectorAll(".edit-list")).forEach(function (elem) {
    elem.addEventListener("click", function (event) {
      getEditid = elem.getAttribute("data-edit-id");
      addressListData = addressListData.map(function (item) {
        if (item.id == getEditid) {
          editlist = true;
          document
            .getElementById("createAddress-form")
            .classList.remove("was-validated");
          document.getElementById("addAddressModalLabel").innerHTML =
            "Edit Address";
          document.getElementById("addNewAddress").innerHTML = "Save";

          document.getElementById("addressid-input").value = item.id;
          document.getElementById("addaddress-Name").value = item.name;
          document.getElementById("addaddress-textarea").value = item.address;
          document.getElementById("addaddress-phone").value = item.phone;
          document.getElementById("state").value = item.addressType;
        }
        return item;
      });
    });
  });
}

// removeItem
function removeItem() {
  var getid = 0;
  Array.from(document.querySelectorAll(".remove-list")).forEach(function (
    item
  ) {
    item.addEventListener("click", function (event) {
      getid = item.getAttribute("data-remove-id");
      document
        .getElementById("remove-address")
        .addEventListener("click", function () {
          deleteAddress(getid);
          console.log(getid);
          document.getElementById("close-removeAddressModal").click();
        });
    });
  });
}

window.addEventListener('click', (e) => {
    // Check if the clicked element or any of its ancestors have the class "form-check"
    const formCheckElement = e.target.closest('.form-check');
    
    // If a ".form-check" element is found
    if (formCheckElement) {
        const addType = formCheckElement.querySelector('.text-uppercase').innerHTML.split(' ')[0]; // Output the found element
        //Set this checked to true and the other's to false.
        selectAddress(addType);
    }
});

async function selectAddress(type){
    console.log(type);
    const data = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({type:type})
      };
      const addressSelected = await fetch(`http://127.0.0.1:2500/user/address/select`, data);
      if (addressSelected.ok) {
        console.log('success');
       getAddress();
      }else{
        const err = await addressSelected.text();
        console.log(err);
      }
  }
