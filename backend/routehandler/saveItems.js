const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Route handler to save an item
exports.saveItem = async (req, res) => {
    const { itemId } = req.body; // Assuming itemId is the ID of the item to be saved
    
    try {
      // Find the current user
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      // Check if the item is already saved
      if (user.savedItems.includes(itemId)) {
        return res.status(400).json({ message: 'Item already saved.' });
      }
      
      // Save the item ID to the user's savedItems array
      user.savedItems.push(itemId);
      
      // Save the updated user document
      await user.save();
      
      // Send a success response
      res.status(200).json({ message: 'Item saved successfully.' });
    } catch (error) {
      console.error('Error saving item:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
  // Route handler to view saved items
exports.getSavedItems =  async (req, res) => {
    try {
      // Find the current user
      const user = await User.findById(req.user._id).populate('savedItems');
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      // Retrieve additional details for each saved item (if needed)
      const savedItems = user.savedItems;
      
      // Send the list of saved items to the client
      res.status(200).json({ savedItems });
    } catch (error) {
      console.error('Error fetching saved items:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

// Route handler to delete saved items
exports.deleteSavedItems = async (req, res) => {
    const itemId = req.params.itemId;
    
    try {
      // Find the current user
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      // Remove the item ID from the user's savedItems array
      user.savedItems = user.savedItems.filter(id => id !== itemId);
      
      // Save the updated user document
      await user.save();
      
      // Send a success response
      res.status(200).json({ message: 'Item deleted from saved items.' });
    } catch (error) {
      console.error('Error deleting item from saved items:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
