const express = require("express");
const route = express.Router()
const { salesAuth, auth, adminAuth } = require("../middleware/auth");

route.post('/user/recently-viewed');

route.get('/user/recently-viewed')