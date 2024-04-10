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
      
      validateInput()
        
    
     
  });

});
function validateInput() {
    const email = document.getElementById('sign-in-useremail').value.trim();
  const password = document.getElementById('sign-in-password-input').value.trim();
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email is empty or doesn't match the regex
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Check if password is empty or too short
    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
    }

    // All validations passed
    entryForm('new',email, password)
    // return true;
}

async function entryForm(type,email, password) {
    
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
          const errorData = await response.json();
          alert(`${errorData.message}`);
          console.log(errorData);
          return errorData.message
      }

  } catch (error) {
      // Handle errors
      console.error('Error during authentication:', error.message);
  }
};


// Function to set a cookie
// function setCookie(name, value, days) {
//     var expires = "";
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// // Usage example
// setCookie('jwt', token, 7); // Sets a cookie named 'jwt' with the token value that expires in 7 days
