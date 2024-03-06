const token = sessionStorage.getItem("token");
const username = sessionStorage.getItem("username");

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
    const userAddress = await fetch(`http://127.0.0.1:4000/user/address`, data);
    if ( userAddress.ok) {
      const addresses = await userAddress.json();
      console.log(addresses);
    }
  }
  getAddress();

  