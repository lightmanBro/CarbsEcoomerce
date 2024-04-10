const express = require("express");
const route = express.Router();
const {getCartItems,deleteCartProduct,postCartItem} = require("../routehandler/cart")
const { salesAuth, auth, adminAuth } = require("../middleware/auth");


//User Routes
route.post("/cart/:productId",auth,postCartItem);
route.get("/carts",auth,getCartItems);
route.delete("/cart/:productId",auth,deleteCartProduct)


module.exports = route;