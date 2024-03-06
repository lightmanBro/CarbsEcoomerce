const mongoose = require("mongoose");
//The review will be Attached to a post route so a review can be done on a post
const reviewSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId },
  itemId: { type: mongoose.Schema.Types.ObjectId },
  comments: { types: String },
  date: { type: Date },
});

module.exports =  mongoose.model("Review", reviewSchema);
