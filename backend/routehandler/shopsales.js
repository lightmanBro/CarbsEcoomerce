const Product = require("../models/item");
const Order = require("../models/order");

// Route for a sales rep to sell products to a walk-in customer
// orderController.js
// ... (existing code)

// Route for a sales rep to sell products to a walk-in customer
exports.shopSales = async (req, res) => {
  try {
    const salesRep = req.user;
    const itemsToSell = req.body; // An array of objects with productId and quantity

    let orderItems = [];
    let totalAmount = 0;

    // Loop through the items to sell and validate each product
    for (const item of itemsToSell) {
      const productId = item.productId;
      const quantity = item.quantity;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          status: "Failed",
          message: `Product with ID ${productId} not found`,
        });
      }

      if (product.quantity < quantity) {
        return res.status(300).json({
          status: "Failed",
          message: `Not enough stock available for product ${product.productTitle}.`,
        });
      }

      // Calculate the total amount based on the product price and quantity
      const itemTotalAmount = product.price * quantity;
      totalAmount += itemTotalAmount;

      // Update stock and available values for the product
      product.stock -= quantity;
      product.available -= quantity;

      // Update the number of orders for the product
      product.orders += quantity;

      await product.save();

      orderItems.push({
        product: productId,
        quantity,
        price: product.price,
        totalAmount: itemTotalAmount,
      });
    }

    // Create an order for the walk-in customer
    const order = new Order({
      salesRep: salesRep._id,
      items: orderItems,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      status: "Success",
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};
