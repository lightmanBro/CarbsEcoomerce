const express = require("express");
const route = express.Router()
const { salesAuth, auth, adminAuth } = require("../middleware/auth");
const {saveItem,getSavedItems,deleteSavedItems} = require('../routehandler/saveItems');

route.post('/user/saved-items');

route.get('/user/saved-items');

route.delete('/user/saved-items/:itemId')

module.exports = route;