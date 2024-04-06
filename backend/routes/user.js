const express = require("express");
const crypto = require("crypto");
const route = express.Router();
const User = require("../models/user");
const { auth } = require("../middleware/auth");

// const {sendEmail} = require('../utilities/mailer')

//Sign up a user DONE
//login a user DONE
//Check user details DONE
//Upload user image
//Edit and update user details
//Forgot Password DONE
//Reset Password DONE
//Change Password DONE

//Sign up a new user
route.post("/user/new", async (req, res) => {
  const { email, password } = req.body;
  const user = await new User({ email, password });
  const token = await user.generateAuthToken();
  // if(user){
  //   return res.status(300).json({status:"Failed",message:"Email already exists"})
  // }
  //mailer function needs to be called here
  try {
    user.availabilityStatus = "online";
    user.role = "customer";
    await user.save();
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: true,
      httpOnly: true,
    });

    res.send({ user, token });
    //Send a welcome message to the user via email,
    // sendEmail(user.email, subject, text, html)
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Login an existing user
//Save the user last login date

route.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find the user by credentials
      const user = await User.findByCredentials(email, password);      
      if (!user) {
          // User not found
          return res.status(404).send({ status: "failed", message: "User not found" });
      }

      // Save the user's last login date
      user.lastLoginDate = new Date();
      await user.save();

      // Generate authentication token
      const token = await user.generateAuthToken();

      // Send the user and token in the response
      res.status(200).send({ status: "success", email: user.email, token });
  } catch (error) {
      // Handle other errors
      res.status(500).send({ status: "error", message: error.message });
  }
});


//Upload a new Profile Picture
route.post("/user/photo/new", auth, async (req, res) => {
  //Remove the current photo
  //Upload a new photo with the userId as the photo name
});


//Upload a new Profile Picture
route.post("/user/photo/update", auth, async (req, res) => {
  //Remove the current photo
  //Upload a new photo with the userId as the photo name
});


//DONE
// Check personal credentials
route.get("/user/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

route.patch("/user/update", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidUpdates = updates.every((update) => {
    allowedUpdates.includes(update);
  });
  if (!isValidUpdates) res.status(400).send("Invalid Update");
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(201).send("Update Applied Succesfull");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Set delivery Address
route.post("/user/address",auth, async (req,res)=>{
  const user = req.user;
  const {type,details} = req.body
  try {
    if(user.setAddress(type,details)) res.status(201).json({status:"Success",data:user.address[type]})
  } catch (error) {
    res.status(400).send(error.message);
  }
})

//Get Address
route.get("/user/address",auth, async (req,res)=>{
  const user = req.user;
  try {
    // const {home,office} = user.getAddress(); 
    res.status(200).send({status:"Success",address:[user.address.home,user.address.office]})
  } catch (error) {
    res.status(500).send(error.message)
  }
  
})
route.delete('/user/address', auth, async (req, res) => {
  console.log('Delete route hit');
  const userId = req.user._id;
  const { type } = req.body;
  try {
    // Use Mongoose's findOneAndUpdate to remove the address from the user's document
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $unset: { [`address.${type}`]: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(204).end(); // Send success response with status 204 No Content
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).send('Error deleting address');
  }
});

route.post('/user/address/select', auth, async (req, res) => {
  const user = req.user;
  const { type } = req.body;
  console.log(req.body);
  try {
    // Set the selected address type to true and all other types to false
    const addressChecked = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          [`address.${type}.checked`]: true,
          'address.home.checked': type !== 'home' ? false : true,
          'address.office.checked': type !== 'office' ? false : true
        }
      },
      { new: true }
    );
    if (!addressChecked) {
      return res.status(404).send('User not found');
    }
    res.status(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});





//Reset Password and send a reset link to user email;DONE
route.post("/user/forgotPassword", async (req, res) => {
  //Find user by email address
  const user = await User.findOne({ email: req.body.email });

  //If user is not found, return error
  if (!user) return res.status(404).send("User not found");

  try {
    //Create a reset token
    const resetToken = user.createPasswordResetToken();

    //This is the reset token url to be sent to the user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/user/resetPassword/${resetToken}`;

    //Save the user
    await user.save({ validateBeforeSave: false });

    res.status(200).send({ resetToken, user, resetUrl: resetURL });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//Reset password with the link from the mail; DONE
route.patch("/user/resetPassword/:token", auth, async (req, res) => {
  //Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // passwordResetExpires: { $gt: Date.now() },
  });

  //If no user with the email return an error
  if (!user) {
    return res
      .status(400)
      .send({ message: "Token is invalid or expired", hashedToken });
  }
  //Set the new password if there is a user and token has not expired
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //Update changedPasswordAt property for the user

  // Log the user in
  const token = await user.generateAuthToken();
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  });
  res.status(200).send({ user, token });
});

route.patch("/user/password/reset", auth, async (req, res) => {
  //Get User from collection
  const user = User.findById(req.user._id).select("+password");

  //Check if the posted password is thesame as the available password
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return res.status(400).send("Your password is not correct");
  }
  //If so, update the password
  user.password = req.body.password;
  await user.save();

  //Log the user in, send the JWT to the user
  const token = await user.generateAuthToken();
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  });
  res.status(200).send({ user, token });
});

// Logout route
route.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.clearCookie("jwt"); // Clear the JWT cookie on logout

    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete user account
//Delete all the posts owned by this user.
route.delete("/user/delete", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.clearCookie("jwt"); // Clear the JWT cookie on successful deletion
    res.status(200).send({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = route;
