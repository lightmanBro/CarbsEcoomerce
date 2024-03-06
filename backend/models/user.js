const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "An email is required"],
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate(value) {
      if (value.length < 6 || value.toLowerCase().includes("Password")) {
        throw new Error(
          "Password cannot be less than 6 or password cannot contain the word password"
        );
      }
    },
  },
  role: {
    type: String,
    enum: ["support", "sales", "customer"],
    default: "customer",
  },
  tokens: [{ token: { type: String, required: true } }],
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  zipCode: { type: Number, trim: true, max: 9, min: 5 },
  postalCode: { type: Number, trim: true, max: 8, min: 6 },
  phoneNumber: { type: Number, trim: true },
  address: {
    home: {
      type: Object,
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      state:{type:String},
      checked: { type: Boolean },
    },
    office: {
      type: Object,
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      state:{type:String},
      checked: { type: Boolean },
    },
  },
  shoppingCart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  savedSearches: [{ type: mongoose.Schema.Types.ObjectId }],
  recentlyViewedItems: [{ type: mongoose.Schema.Types.ObjectId }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: { type: Date },
  lastLoginDate: { type: Date },
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
      return;
    }

    return user;
  } catch (error) {
    // console.error("Error in findByCredentials:", error);
    return error;
  }
};
userSchema.methods.addToShoppingCart = async function (productId) {
  const user = this;
  if (!user.shoppingCart.includes(productId)) {
    user.shoppingCart.push(productId);
    await user.save();
  }
};

userSchema.methods.removeFromShoppingCart = async function (productId) {
  const user = this;
  if (user.shoppingCart.includes(productId)) {
    user.shoppingCart = user.shoppingCart.filter(
      (item) => !item.equals(productId)
    );
    await user.save();
  }
};

userSchema.methods.saveOrderId = async function (orderId) {
  const user = this;
  user.orders.push(orderId);
  await user.save();
};
userSchema.methods.clearShoppingCart = async function () {
  const user = this;
  user.shoppingCart = [];
  await user.save();
};

//Address
userSchema.methods.setAddress = async function (type, details) {
  const user = this;
  if(type==='home'){
    user.address.home = { ...details };
    await user.save();
    return true
  }else{
    user.address.office = { ...details };
    await user.save();
    return true
  }
};



userSchema.methods.updateAdrress = async function(type, details){
  const user = this;
  if(type==='home'){
    user.address.home = { ...details };
  }else{
    user.address.office = { ...details };
  }
  await user.save();
}

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // const salt = await bcrypt.genSalt(10)
    this.passwordChangedAt = Date.now() - 2000; //To delay the hasing
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
