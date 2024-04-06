Array.from(document.querySelectorAll("form .auth-pass-inputgroup")).forEach(function(e) {
    Array.from(e.querySelectorAll(".password-addon")).forEach(function(r) {
        r.addEventListener("click", function(r) {
            var o = e.querySelector(".password-input");
            "password" === o.type ? o.type = "text" : o.type = "password"
        })
    })
});

document.addEventListener('DOMContentLoaded', function () {
  
  const signUpform = document.getElementById('signUp');
  signUpform.addEventListener('submit', function (e) {
      e.preventDefault();
      entryForm('new')
  });

});

async function entryForm(type) {
  const email = document.getElementById('sign-in-useremail').value;
  const password = document.getElementById('sign-in-password-input').value;

  try {
      const header = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      }
      const response = await fetch(`http://127.0.0.1:2500/user/${type}`, header);

      if (response.ok) {
          const data = await response.json();
          const {email,token} = data;
          // Store the token in localStorage
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('username',email);
          // Use the user data as needed (for example, display user information)
          // console.log('User authenticated successfully:', email,token);

          // Redirect to a new page or perform other actions
          window.location.href = '/'; // Replace './index.html' with the desired path
      } else {
          // Handle non-successful response
          const errorData = await response.text();
          console.log(errorData);
          return errorData.message
      }

  } catch (error) {
      // Handle errors
      console.error('Error during authentication:', error.message);
  }
}
