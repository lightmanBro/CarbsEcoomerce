// const token = sessionStorage.getItem("token");
// const username = sessionStorage.getItem("username");

if (token && username) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("username").innerHTML = username.split("@")[0];
}

// /user/me
async function userData() {
  try {
    const header = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`http://127.0.0.1:2500/user/me`, header);

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      /*data objects
      {
          "address":{},
          "firstName":"",
          "lastName":"",
          "ZipCode":"",
          "postalCode":"",
          "phoneNumber":"",
          "email": "lightmanbroinnovation@gmail.com",
          "shoppingCart": [],
          "savedSearches": [],
          "recentlyViewedItems": [],
          "orders": []
      }
      */
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
userData();

// async function getAddress() {
//     const data = {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const userAddress = await fetch(`http://127.0.0.1:2500/user/address`, data);
//     if ( userAddress.ok) {
//       const addresses = await userAddress.json();
//       loadAddressList(addresses.address);
//       console.log(addresses.address)
//     }
//   }
//   getAddress();

function loadAddressList(datas) {
  document.getElementById("address-list").innerHTML = "";
  Array.from(datas).forEach(function (listdata) {
    var checkinput = listdata.checked ? "checked" : "";
    document.getElementById(
      "address-list"
    ).innerHTML += ` <div class="col-md-6">
    <div class="card mb-md-0">
        <div class="card-body"> 
            <div class="float-end clearfix"> <a href="/address" class="badge bg-primary-subtle text-primary "><i class="ri-pencil-fill align-bottom me-1"></i> Edit</a> </div>
            <div> 
                <p class="mb-3 fw-semibold fs-12 d-block text-muted text-uppercase">${listdata.state} Address</p> 
                <h6 class="fs-14 mb-2 d-block">${listdata.name}</h6> 
                <span class="text-muted fw-normal text-wrap mb-1 d-block">${listdata.address}</span> 
                <span class="text-muted fw-normal d-block">${listdata.phone}</span> 
            </div> 
        </div>
    </div>
</div>`;
  });
};


//Changing password from in app user details page
// Get input values
const oldPassword = document.getElementById('oldPassword').value;
const newPassword = document.getElementById('newPassword').value;
const confirmPassword = document.getElementById('confirmPassword').value;

// Validate input
if (!oldPassword || !newPassword || !confirmPassword) {
  alert('Please fill in all fields.');
  return;
}
if (newPassword !== confirmPassword) {
  alert('New password and confirm password do not match.');
  return;
}

// Send request to backend
async function passwordChange(oldPassword, newPassword){
    try {
      const response = await fetch('/user/password/reset/inapp', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }
      
      alert('Password changed successfully.');
    } catch (error) {
      console.error('Error changing password:', error.message);
      alert('An error occurred. Please try again later.');
    }

}
// Function to update user information
async function updateUserInformation(event) {
  event.preventDefault();
  
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    city: document.getElementById('city').value,
    zipCode: document.getElementById('zipCode').value,
    country: document.getElementById('country').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  
  try {
    const response = await fetch('/user/update', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData);
      return;
    }
    
    alert('User information updated successfully.');
  } catch (error) {
    console.error('Error updating user information:', error);
    alert('An error occurred. Please try again later.');
  }
}

// Function to set delivery address
async function setDeliveryAddress(event) {
  event.preventDefault();
  
  const formData = {
    type: document.getElementById('addressType').value,
    details: {
      name: document.getElementById('addressName').value,
      address: document.getElementById('addressAddress').value,
      phone: document.getElementById('addressPhone').value,
      state: document.getElementById('addressState').value
    }
  };
  
  try {
    const response = await fetch('/user/address', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData);
      return;
    }
    
    alert('Delivery address set successfully.');
  } catch (error) {
    console.error('Error setting delivery address:', error);
    alert('An error occurred. Please try again later.');
  }
}

// Event listeners for form submissions
document.getElementById('updateUserForm').addEventListener('submit', updateUserInformation);
document.getElementById('setDeliveryAddressForm').addEventListener('submit', setDeliveryAddress);

// Function to select the address type
async function selectAddressType(type) {
  try {
    const response = await fetch('/user/address/select', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }) // Send the selected address type in the request body
    });

    if (!response.ok) {
      throw new Error('Failed to select address type');
    }

    alert('Address type selected successfully');
  } catch (error) {
    console.error('Error selecting address type:', error);
    alert('An error occurred. Please try again later.');
  }
}

// Usage example: Call this function with the desired address type ('home' or 'office')
selectAddressType('home');


// function harvest(id) {
//   // Get form reference
//   const form = document.getElementById(id);

//   // Get an array of key-value pairs from the form elements
//   const formDataArray = Array.from(form.elements)
//     .filter((element) => (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA')) // Include textarea elements
//     .map((element) => [element.name, element.value]); // Map to key-value pairs

//   // Convert the array of key-value pairs to an object using Object.fromEntries
//   const formData = Object.fromEntries(formDataArray);

//   console.log(formData);
// }
// function resetPassword(id) {
//     // Get form reference
//     const form = document.getElementById(id);
//     if(id) {

//     }
//       // Get an array of key-value pairs from the form elements
//       const formDataArray = Array.from(form.elements)
//         .filter((element) => element.nodeName === 'INPUT') // Filter only input elements
//         .map((element) => [element.name, element.value]); // Map to key-value pairs

//       // Convert the array of key-value pairs to an object using Object.fromEntries
//       const formData = Object.fromEntries(formDataArray);

//       console.log(formData);

// }
// const personalDetailsForm = document.getElementById('personal-details');
// const submitBtn = document.getElementById('submit-btn');

// submitBtn.addEventListener('click', (e) => {
//   console.log('submit btn clicked');
//   harvest('personal-details');
//   resetPassword('password-form')
// });

// submitBtn.addEventListener("click", async (e) => {
//   console.log("submit btn clicked");

//   // Harvest the form data
//   const formData = harvest("personal-details");

//   // Send the form data to the backend
//   const data = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ type: "personal", details: formData }),
//   };

//   const userData = await fetch(`http://127.0.0.1:2500/user/userdetails`, data);

//   if (userData.ok) {
//     const userDatas = await userData.json();
//     // Get the list of the address after a new one is set.
//     getAddress();
//     console.log(userDatas);
//   }
// });
