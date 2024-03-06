const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE_URL,{
    socketTimeoutMS:10*60*1000,
    family:4|6
  })
  .then(() => console.log("connected to the database"))
  .catch((err) => {
    console.log(err.message);
  });
