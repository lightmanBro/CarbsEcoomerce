// const token = sessionStorage.getItem("token");
// const username = sessionStorage.getItem("username");

if (token && username) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("username").innerHTML = username.split("@")[0];
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
    if ( userAddress.ok) {
      const addresses = await userAddress.json();
      loadAddressList(addresses.address);
      console.log(addresses.address)
    }
  }
  getAddress();

// loadAddressList(addressListData);

function loadAddressList(datas) {
  document.getElementById("address-list").innerHTML = "";
  Array.from(datas).forEach(function (listdata) {
    var checkinput = listdata.checked ? "checked" : "";
    document.getElementById("address-list").innerHTML  += 
   ` <div class="col-md-6">
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
</div>`

 
  });
}
function harvest(id) {
  // Get form reference
  const form = document.getElementById(id);

  // Get an array of key-value pairs from the form elements
  const formDataArray = Array.from(form.elements)
    .filter((element) => (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA')) // Include textarea elements
    .map((element) => [element.name, element.value]); // Map to key-value pairs

  // Convert the array of key-value pairs to an object using Object.fromEntries
  const formData = Object.fromEntries(formDataArray);

  console.log(formData);
}
function resetPassword(id) {
    // Get form reference
    const form = document.getElementById(id);
    if(id) {
      
    }
      // Get an array of key-value pairs from the form elements
      const formDataArray = Array.from(form.elements)
        .filter((element) => element.nodeName === 'INPUT') // Filter only input elements
        .map((element) => [element.name, element.value]); // Map to key-value pairs
    
      // Convert the array of key-value pairs to an object using Object.fromEntries
      const formData = Object.fromEntries(formDataArray);
    
      console.log(formData);
    
}
const personalDetailsForm = document.getElementById('personal-details');
const submitBtn = document.getElementById('submit-btn');

submitBtn.addEventListener('click', (e) => {
  console.log('submit btn clicked');
  harvest('personal-details');
  resetPassword('password-form')
});



submitBtn.addEventListener("click", async (e) => {
  console.log("submit btn clicked");

  // Harvest the form data
  const formData = harvest("personal-details");

  // Send the form data to the backend
  const data = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "personal", details: formData }),
  };

  const userData = await fetch(`http://127.0.0.1:2500/user/userdetails`, data);

  if (userData.ok) {
    const userDatas = await userData.json();
    // Get the list of the address after a new one is set.
    getAddress();
    console.log(userDatas);
  }
});





