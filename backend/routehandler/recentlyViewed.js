const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { Product } = require('../models/item');

// Route handler to save recently viewed item IDs
exports.addRecentlyViewed =  async (req, res) => {
  const { itemIds } = req.body; // Assuming itemIds is an array of recently viewed item IDs sent from the client
  
  try {
    // Find the current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Update the user's recently viewed items array with the new item IDs
    user.recentlyViewedItems.push(itemIds);
    
    // Save the updated user document
    await user.save();
    
    // Send a success response
    res.status(200).json({ message: 'Recently viewed items saved successfully.' });
  } catch (error) {
    console.error('Error saving recently viewed items:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Route handler to view recently viewed items
exports.getRecentlyViewed = async (req, res) => {
    try {
      // Find the current user
      const user = await User.findById(req.user._id).populate('recentlyViewedItems');
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      // Retrieve all the product documents corresponding to the product IDs in recentlyViewedItems
        const recentlyViewedItems = await Product.find({ _id: { $in: user.recentlyViewedItems } });
      
      // Send the list of recently viewed items to the client
      res.status(200).json({ recentlyViewedItems });
    } catch (error) {
      console.error('Error fetching recently viewed items:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
module.exports = router;
