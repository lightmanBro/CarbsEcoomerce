const { Product } = require("../models/item");
const Order = require("../models/order");

// Route to place an order
//When an order is placed then it should reflect in the notification and send an email to the sales department.
// Route to place an order
// When an order is placed then it should reflect in the notification and send an email to the sales department.
exports.createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { items, address } = req.body;
    const deliveryAddress = user.address[address].toString();
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(404)
            .json({ status: "Failed", message: "Product not found" });
        }
        return {
          product: item.productId,
          quantity: item.quantity || 1,
          price: product.price,
        };
      })
    );

    // Calculate totalAmount and update product availability
    let totalAmount = 0;
    for (const orderItem of orderItems) {
      const product = await Product.findById(orderItem.product);
      if (!product) {
        return res
          .status(404)
          .json({
            status: "Failed",
            message: `Product with ID ${orderItem.product} not found.`,
          });
      }

      if (orderItem.quantity > product.available) {
        return res
          .status(400)
          .json({
            status: "Failed",
            message: `Not enough stock available for product ${product.productTitle}.`,
          });
      }

      totalAmount += orderItem.quantity * orderItem.price; // Use the price from the order item

      // Deduct the ordered quantity from the available stock
      product.available -= orderItem.quantity;

      // Update the number of orders for the product
      product.orders += orderItem.quantity;

      await product.save();
    }

    const order = new Order({
      customer: user._id,
      salesRep: user.salesRep || "customer", // Assuming you have a salesRep field in the User model
      items: orderItems,
      deliveryAddress,
      totalAmount: totalAmount,
    });
    user.saveOrderId(order._id);
    await order.save();

    res.status(201).json({
      status: "Success",
      message: "Order placed successfully",
      orderId: order._id, // Include the ID of the created order in the response
      totalAmount: totalAmount,
    });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};
/*
async function createOrder(items=[], address) {
  const token = sessionStorage.getItem('token'); // Assuming you're storing the token in sessionStorage
  
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  
  const body = JSON.stringify({ items, address });
  
  try {
    const response = await fetch('/user/orders', {
      method: 'POST',
      headers,
      body
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Order created successfully:', data);
      return data; // Return the order details if needed
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error('Error creating order:', error.message);
    throw error; // Rethrow the error to handle it at the caller's level
  }
}

*/

// Get all the orders
exports.getOrder = async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.find({ customer: user._id });
    res.status(200).json({ status: "Success", data: orders });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

// Route to start processing the customer order by the sales rep
exports.updateOrder= async (req, res) => {
  const { status, deliveryTime, deliveryType } = req.body; // Add deliveryTime and deliveryType to your request body

  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Order not found" });
    }
    // Ensure that the order belongs to the logged-in sales rep
    if (order.salesRep.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Unauthorized access to the order",
      });
    }

    // Update order details
    order.salesRep = req.user._id;
    order.processedDate = new Date();

    // Calculate the delivery date based on the specified time and type (hours or days)
    const deliveryDate = new Date();

    if (deliveryType === "hours") {
      deliveryDate.setHours(deliveryDate.getHours() + deliveryTime);
    } else if (deliveryType === "days") {
      deliveryDate.setDate(deliveryDate.getDate() + deliveryTime);
    } else {
      return res
        .status(400)
        .json({ status: "Failed", message: "Invalid deliveryType" });
    }

    // Check if the calculated deliveryDate is a valid date
    if (isNaN(deliveryDate.getTime())) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Invalid delivery date" });
    }

    order.deliveryDate = deliveryDate;
    order.status = status;

    await order.save();

    res.status(200).json({ status: "Success", data: order });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};


// Search for orders by Customer or OrderId
//Either this is done on the front-End or by querying the backend;
exports.searchOrders = async (req, res) => {
  try {
    const { query } = req.params;
    const orders = await Order.find({
      $or: [
        { "customer.username": { $regex: query, $options: "i" } },
        { _id: mongoose.Types.ObjectId(query) },
        {status: query}
      ],
    }).populate("items.product");

    res.status(200).json({ status: "Success", orders });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};

// List orders based on status
exports.listOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.find({ status }).populate("items.product");

    res.status(200).json({ status: "Success", orders });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};

// Function to cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "Failed",
        message: `Order with ID ${orderId} not found`,
      });
    }

    // Mark the order as cancelled
    order.status = "Cancelled";
    order.processedDate = new Date();
    await order.save();

    // Update stock and available values for each product in the cancelled order
    for (const item of order.items) {
      const productId = item.product;
      const quantity = item.quantity;

      const product = await Product.findById(productId);

      if (!product) {
        // Handle the case where the product is not found (optional)
        console.error(`Product with ID ${productId} not found`);
        continue;
      }

      // Restore stock and available values for the cancelled order
      product.stock += quantity;
      product.available += quantity;
      product.orders -= quantity;

      await product.save();
    }

    res.status(200).json({
      status: "Success",
      message: `Order ${orderId} has been cancelled`,
      cancelledOrder: order,
    });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};

