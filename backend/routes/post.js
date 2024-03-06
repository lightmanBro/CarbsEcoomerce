const express = require("express");

const { salesAuth, auth, adminAuth } = require("../middleware/auth");

const route = express.Router();
const { uploadBucket } = require("../utilities/utils");
const { shopSales } = require("../routehandler/shopsales");
const { upload } = uploadBucket("Item-media-files");

const { updateBrand, updateItem, subCategoryUpdate, updateCategory } = require("../routehandler/editposts");
const {
  newBrand,
  newCategory,
  newSubCategory,
  newItem,
} = require("../routehandler/newpost");
const { downloadFile } = require("../routehandler/downloadfile");
const {
  getItem,
  getBrandProducts,
  getSubCategoryProducts,
  getCategoryProducts,
  getAllProducts,
  getBrands,
  getCategory,
  getSubCategory,
  getAllProductsBackend
} = require("../routehandler/getpost");
const { deleteBrand, deleteItem } = require("../routehandler/deletepost");


//Create a new post
route.get("/items", getAllProducts);
route.get("/items/back",auth,salesAuth,getAllProductsBackend);
route.post("/items", auth, salesAuth, upload.array("files"), newItem);
route.post("/items", auth, adminAuth, upload.array("files"), newItem);
route.patch("/items",auth, salesAuth, upload.array("files"),updateItem)
route.get("/items/:id", getItem);
route.delete("/item/:id", auth, salesAuth, deleteItem);
route.delete("/item/:id", auth, adminAuth, deleteItem);

//New Brand
route.post("/brand", auth, salesAuth, upload.array("files"), newBrand);
route.post("/brand", auth, adminAuth, upload.array("files"), newBrand);
route.get("/brand/:title", auth, adminAuth, getBrandProducts);
route.patch("/brand",auth,salesAuth,updateBrand);

//New Category
route.post("/category", auth, salesAuth, newCategory);
route.get("/category", auth, salesAuth, getCategory);
route.patch("/category",auth,salesAuth,updateCategory);
route.get("/item/category/:title", auth, adminAuth, getCategoryProducts);
route.get("/item/category/:title", auth, salesAuth, getCategoryProducts);

//New SubCategory
route.post("/subcategory", auth, salesAuth, newSubCategory);
route.get("/subcategory",auth, salesAuth, getSubCategory);
route.patch("/subcategory",auth,salesAuth,subCategoryUpdate);
route.get("/item/subCategory/:id", auth, adminAuth, getSubCategoryProducts);
route.get("/item/subCategory/:id", auth, salesAuth, getSubCategoryProducts);


//Sale from shop
route.post("/item/order/shop", auth, salesAuth, shopSales);
route.post("/item/order/shop", auth, adminAuth, shopSales);

//Download the post file to be viewed in the client
route.get("/item/files/:fileName", downloadFile);


//Get all Brands
route.get("/brand", auth, salesAuth, getBrands);
route.patch("/brand/:id", upload.array("files"), auth, salesAuth, updateBrand);
route.patch("/brand/:id", upload.array("files"), auth, adminAuth, updateBrand);
route.delete("/brand/:id", auth, salesAuth, deleteBrand);
route.delete("/brand/:id", auth, adminAuth, deleteBrand);

module.exports = route;
