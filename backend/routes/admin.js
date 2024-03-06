const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const { Product } = require("../models/item");
const Order = require("../models/order");
const User = require("../models/user");
const Admin = require("../models/admin");

router.post("/xyz11%%/new", async (req, res) => {
  const { email, password } = req.body;
  const admin = new Admin({ email, password });
  const token = await admin.generateAuthToken();
  try {
    await admin.save();
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: true,
      httpOnly: true,
    });
    res.send({ admin, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/xyz11%%/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by credentials
    const admin = await Admin.findByCredentials(email, password);

    // Save the admin's last login date
    admin.lastLoginDate = new Date();
    await admin.save();
    // Generate authentication token
    const token = await admin.generateAuthToken();

    // Send the admin and token in the response
    res.status(200).send({ admin, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//DONE
// Route for admin to view available items
router.get("/admin/items", auth, adminAuth, async (req, res) => {
  try {
    const items = await Product.find();
    res.status(200).json({ status: "Success", data: items });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
});

//DONE
// Route for admin to view sales made by sales reps
router.get("/admin/sales-reps-sales", auth, adminAuth, async (req, res) => {
  try {
    const salesRepsSales = await Order.aggregate([
      {
        $group: {
          _id: "$salesRep",
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "users", // Use the actual collection name for users
          localField: "_id",
          foreignField: "_id",
          as: "salesRepInfo",
        },
      },
      {
        $unwind: "$salesRepInfo",
      },
      {
        $project: {
          salesRepId: "$_id",
          totalSales: 1,
          salesRepName: {
            $concat: ["$salesRepInfo.firstName", " ", "$salesRepInfo.lastName"],
          },
        },
      },
    ]);

    res.status(200).json({ status: "Success", data: salesRepsSales });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
});

//DONE
// Route for admin to view order summary
router.get("/admin/order-summary", auth, adminAuth, async (req, res) => {
  try {
    const orderSummary = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.status(200).json({ status: "Success", data: orderSummary[0] });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
});

//DONE
// Route for admin to view daily earnings
router.get("/admin/daily-earnings", auth, adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyEarnings = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const data =
      dailyEarnings.length > 0 ? dailyEarnings : "No earnings yet today";
    res.status(200).json({ status: "Success", data });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
});

//DONE
// Route for admin to view weekly earnings
router.get("/admin/weekly-earnings", auth, adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );

    const weeklyEarnings = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const data =
      weeklyEarnings.length > 0 ? weeklyEarnings : "No earnings yet today";
    res.status(200).json({ status: "Success", data: data[0] });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
});

//DONE
//Get the numbers of remaining items
router.get(
  "/admin/remaining-items/:productTitle",
  auth,
  adminAuth,
  async (req, res) => {
    const { productTitle } = req.params;
    try {
      const product = await Product.findOne({ productTitle });

      res.status(200).json({
        status: "Success",
        available: product.available,
        stock: product.stock,
      });
    } catch (error) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }
);

//DONE
// Route for admin to register a sales rep
router.post("/admin/register-sales-rep", auth, adminAuth, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if the provided email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email is already registered" });
    }

    // Create a new sales rep user
    const salesRep = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || "sales", // Default role to "sales" if not provided
    });

    await salesRep.save();

    res.status(201).json({
      status: "Success",
      message: "Sales rep registered successfully",
      user: salesRep,
    });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
});

//DONE
router.post("/xyz11%%/logout", auth, async (req, res) => {
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

//DONE
// Route for admin to remove a sales rep
router.delete(
  "/admin/remove-sales-rep/:salesRepId",
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const salesRepId = req.params.salesRepId;

      // Check if the sales rep exists
      const salesRep = await User.findById(salesRepId);
      if (!salesRep || salesRep.role !== "sales") {
        return res
          .status(404)
          .json({ status: "Failed", message: "Sales rep not found" });
      }

      // Remove the sales rep
      await User.findByIdAndDelete(salesRepId);

      res
        .status(200)
        .json({ status: "Success", message: "Sales rep removed successfully" });
    } catch (error) {
      res.status(400).json({ status: "Failed", message: error.message });
    }
  }
);
module.exports = router;
