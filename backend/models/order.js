const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  salesRep: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  processedDate: {
    type: Date,
  },
  deliveryAddress: { type: String },
  deliveryDate: { type: Date },
  status: { type: String, enum: ["PickUps","Pending", "Shipping", "Delivered","Out Of Delivery"] },
});


//List new orders
orderSchema.methods.ListNewOrders = async function(){

}
//List pending orders

//List Deliverd orders

//List Pickup orders

//List Cancelled orders

//Search for orders by Customer or OrderId

/*
Create Order

Order ID
ID auto generated
Customer Name
Enter name
Product

Product
Order Date
Select date
Delivery Date
Select date
Amount
Total amount 
Payment Method Cash

Payment Method
Delivery Status Deliverd for shop sales

*/
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
