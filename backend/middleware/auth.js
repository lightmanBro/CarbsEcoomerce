const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    // console.log(req.user)
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded, "tokens.token": token }) || await Admin.findOne({ _id: decoded, "tokens.token": token });
    // console.log(user)
    if (!user) {
      return res.status(403).json({ status: "Failed", message: "Not authorized. Please provide a valid credential" });
    }

    req.token = token;
    req.user = user;
    req.user.availabilityStatus = "online";
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const salesAuth = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    // console.log(res.user)
    await auth(req, res, async () => {
      // Check if the user has the sales role
      if (req.user.role !== "sales") {
        return res.status(403).json({ status: "Failed", message: "Not authorized" });
      }

      // Additional logic specific to sales authentication can be added here

      next();
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const adminAuth = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    await auth(req, res, async () => {
      // Check if the user has the admin role
      if (req.user.role !== "admin") {
        // Return a 403 Forbidden response when the user is not authorized
        return res.status(403).json({ status: "Failed", message: "Not authorized. Admin role required" });
      }

      // Additional logic specific to admin authentication can be added here

      next();
    });
  } catch (error) {
    // Handle unexpected errors and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ status: "Failed", message: "Internal Server Error" });
  }
};



module.exports = {
  auth,
  salesAuth,
  adminAuth,
};
