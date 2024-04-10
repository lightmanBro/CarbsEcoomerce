const express = require("express");
const route = express.Router();
const {createOrder,getOrder,cancelOrder,updateOrder,listOrdersByStatus,searchOrders} = require("../routehandler/order")
const { salesAuth, auth, adminAuth } = require("../middleware/auth");

//Admin Routes

//Sales Rep Route
route.post("/order",auth,salesAuth,createOrder);
route.get("/order",auth,salesAuth,getOrder);
route.patch("/order/:orderId",auth,salesAuth,updateOrder);
route.patch("/order/cancel",auth,salesAuth,cancelOrder);
route.get("/order/:status",auth,salesAuth,listOrdersByStatus);
route.get("order/:param",auth,salesAuth,searchOrders);

module.exports = route;