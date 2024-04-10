require('./backend/database/mongodb')
const express = require("express");
const multer = require("multer");
const path = require('path');
const hbs = require('hbs');
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());

// Define the config file for express.
const publicDirectory = path.join(__dirname, './public');
const viewPath = path.join(__dirname, './template/views');
const partialsPath = path.join(__dirname, './template/views/partials');

// Setup handlebar's engine and views locator
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve.
app.use(express.static(publicDirectory));

// CORS
const corsOptions = {
  origin: "*", // or an array of allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Because of the multer upload middleware
const postRoute = require("./backend/routes/post");
app.use(postRoute);

app.use(multer().array("files")); // Multer middleware

const userRoute = require("./backend/routes/user");
const adminRoute = require("./backend/routes/admin");
const orderRoute = require("./backend/routes/order");
const cartRoute = require("./backend/routes/cart");
app.use(adminRoute);
app.use(userRoute);
app.use(orderRoute);
app.use(cartRoute);
app.use(helmet()); // Set http security header

// Rate Limiter to prevent brute force attack and denial of server
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Apply rate limiter to specific routes
const rateLimitedRoutes = ["/user", "/post", "/order"]; // Add other rate-limited routes as needed
app.use(rateLimitedRoutes, limiter);

// Include your routes
const filterRoute = require("./backend/utilities/filter");
app.use(filterRoute);

const PORT = process.env.PORT || 2500;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
