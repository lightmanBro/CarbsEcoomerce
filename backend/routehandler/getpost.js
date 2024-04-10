const { Product, Brand,Category, Subcategory } = require("../models/item");

exports.getItem = async (req, res) => {
  try {
    const type = req.params.type;
    const _id = req.params.id;

    // Assuming you have separate models for different property types (e.g., Product, Brand)
    let postModel;

    switch (type) {
      case "product":
        postModel = Product;
        break;
      case "brand":
        postModel = Brand;
        break;
      // Add more cases if you have additional property types
      default:
        return res.status(400).json({ status: "Failed", message: "Invalid property type" });
    }

    const conditions = { _id };
    const update = req.user.role === "customer" ? { $inc: { views: 1 } } : {};

    const post = await postModel.findByIdAndUpdate(conditions, update, { new: true }).lean();

    if (!post) {
      return res.status(404).json({ status: "Failed", message: "Post not found" });
    }

    res.status(200).json({ status: "Success", data: post });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};


exports.filterProducts = async (req, res) => {
  try {
    let filters = {};

    // Extract filter parameters from query string
    const { color, brand, minPrice, maxPrice, size, minRating, maxRating, name } = req.query;

    // Build the filter object based on provided parameters
    if (color) filters.color = color;
    if (brand) filters.brand = brand;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }
    if (size) filters.size = size;
    if (minRating || maxRating) {
      filters.rating = {};
      if (minRating) filters.rating.$gte = parseFloat(minRating);
      if (maxRating) filters.rating.$lte = parseFloat(maxRating);
    }
    if (name) filters.name = { $regex: new RegExp(name, 'i') };

    // Find products matching the filters
    const products = await Product.find(filters);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ status: 'Failed', message: 'Internal server error.' });
  }
};

//Get Brand Products
exports.getBrandProducts = async (req,res)=>{
  const {title} = req.params
  try {
    const brandProducts = await Brand.getProductsByBrand(title);
    res.status(200).json(brandProducts);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().populate('brandProducts'); // Use populate to fetch brandProducts
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getCategory = async (req,res)=>{
  try {
    const categories = await Category.find();
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json(error.message)
  }
}


exports.getSubCategory = async (req,res)=>{
  try {
    const subcategory = await Subcategory.find();
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json(error.message)
  }
}


exports.getCategoryProducts = async (req,res)=>{
  const {title} = req.params
  try {
    const categoryProducts = await Category.getProductsByCategory(title);
    res.status(200).json(categoryProducts);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.getSubCategoryProducts = async (req,res)=>{
  const {id} = req.params
  try {
    const subcategoryProducts = await Subcategory.getProductsBySubcategory(id)
    res.status(200).json(subcategoryProducts);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.getAllProducts = async (req,res)=>{
  try {
    const products = await Product.find({status:{$in:["draft"]}},'color discount price productTitle mediaFilesPicture');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.getAllProductsBackend = async (req,res)=>{
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message)
  }
}

exports.editProduct = async (req,res)=>{
  const {findId, update} = req.body;
  try {
    const products = await Product.findByIdAndUpdate(findId,update);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message)
  }
};