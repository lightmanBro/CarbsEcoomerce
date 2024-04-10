const { Product } = require("../models/item");
// Route to save an item for later
exports.postCartItem =  async (req, res) => {
    try {
      const user = req.user;
      const productId = req.params.productId;
      console.log(productId);
      // Find the product in the shopping cart
      const cartItem = user.shoppingCart.find((item) => item.equals(productId));
  
      if (cartItem) {
        return res.status(400).json({
            status: "Failed",
            message: "Product already in the shopping cart",
        });
      }
      // Add the product to the saved items
      await user.addToShoppingCart(`${productId}`);
  
      res.status(200).json({
        status: "Success",
        message: "Item saved for later",
      });
    } catch (error) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  };
  
  // Route to get all the shopping cart items
  exports.getCartItems =  async (req, res) => {
    try {
      const user = req.user;
      const cartItems = user.shoppingCart;
      //Find the product from the product document.
      const allItems = await Product.find(
        { _id: cartItems },
        "productTitle price available color"
      );
      res.status(200).json({
        status: "Success",
        allItems,
      });
    } catch (error) {
      res.status(400).json({ status: "Failed", message: error.message });
    }
  };
  
  // Route to remove an item from the shopping cart
  exports.deleteCartProduct = async (req, res) => {
    try {
      const user = req.user;
      const productId = req.params.productId;
  
      await user.removeFromShoppingCart(productId);
  
      res.status(200).json({
        status: "Success",
        message: "Item removed from the shopping cart",
      });
    } catch (error) {
      res.status(400).json({ status: "Failed", message: error.message });
    }
  };