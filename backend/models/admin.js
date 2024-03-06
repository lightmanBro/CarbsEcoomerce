const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
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
    enum: ["admin"],
    default: "admin",
  },
  tokens: [{ token: { type: String, required: true } }],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: { type: Date },
  lastLoginDate:{type:Date}
});

adminSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

adminSchema.statics.findByCredentials = async (email, password) => {
  const user = await Admin.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or Password");
  }
  return user;
};

adminSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // const salt = await bcrypt.genSalt(10)
    this.passwordChangedAt = Date.now() - 2000; //To delay the hasing
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
