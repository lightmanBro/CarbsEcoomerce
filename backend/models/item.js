const mongoose = require("mongoose");

//CATEGORY
//Fashion,furniture,Grocery,Kids,Watches,books
const categorySchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: { type: String },
});

/*SUBCATEGORY
books:{
  fantasy,
  horror,
  Mystery,
  Romance
}
*/
const subcategorySchema = new mongoose.Schema({
  id:{type:String},
  title: { type: String },
  description: { type: String },
  category: { type: String, ref: "Category" },
});

const brandSchema = new mongoose.Schema({
  brandName: { type: String, unique: true },
  companyLogo: { type: String },
  brandProducts: [{ type: String, ref: "Product" }],
  views: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    productTitle: { type: String },
    findId: { type: String },
    category: { type: String, ref: "Category" }, // Use String instead of ObjectId
    brand: { type: String, ref: "Brand" }, // Use String instead of ObjectId
    shortDesc: { type: String },
    manufacturer: { type: String },
    price: { type: Number },
    discount: { type: Number },
    rating: { type: Number },
    color: { type: Array },
    size: { type: Array },
    stock: { type: Number },
    available: { type: Number },
    orders: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "schedule", "draft"],
      default: "draft",
    },
    views: { type: Number, default: 0 },
    mediaFilesPicture: [],
    publish:{type:String},
  },
  { timestamps: true }
);

categorySchema.statics.getProductsByCategory = async function (title) {
  const [subcategories] = await Category.find({ title: title }).exec();
  console.log(subcategories);
  const products = await Product.find({ category: subcategories._id }).exec();
  return products;
};

subcategorySchema.statics.getProductsBySubcategory = async function (
  subcategoryTitle
) {
  const products = await Subcategory.find({ title: subcategoryTitle }).exec();
  return products;
};

//Get products by brand
// brand.js (or your model file)
brandSchema.statics.getProductsByBrand = async function (brandName) {
  try {
    const brand = await this.findOne({ brandName }).populate('brandProducts'); // Use populate to fetch brandProducts
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand.brandProducts;
  } catch (error) {
    throw error;
  }
};

productSchema.statics.calculateTotalPrice = async function () {
  // `this` refers to the model
  const products = await this.find();

  // Calculate the total price
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  return totalPrice;
};

categorySchema.statics.populateSubcategories = async function (category) {
  return await category.populate("subcategories").execPopulate();
};

subcategorySchema.statics.populateProducts = async function (subcategory) {
  return await subcategory.populate("brandProducts").execPopulate();
};

brandSchema.statics.populateBrandProducts = async function (brand) {
  return await brand.populate("brandProducts").execPopulate();
};

const Category = mongoose.model("Category", categorySchema);
const Subcategory = mongoose.model("Subcategory", subcategorySchema);
const Brand = mongoose.model("Brand", brandSchema);
const Product = mongoose.model("Product", productSchema);

module.exports = {
  Category,
  Subcategory,
  Brand,
  Product,
};
