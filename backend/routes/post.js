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

route.get('/',(req,res)=>{
  res.render('index')
})
route.get('/indexbackend',(req,res)=>{
  res.render('indexbackend')
})
route.get('/login', (req,res)=> {
  res.render('auth-signin-basic')
})
route.get('/signup', (req,res)=> {
  res.render('auth-signup-basic')
})
route.get('/Shopnow', (req,res)=> {
  res.render('product-grid-sidebar-banner')
})
route.get('/contact', (req,res)=> {
  res.render('contact-us')
})
route.get('/about', (req,res)=> {
  res.render('about-us')
})
route.get('/purchase', (req,res)=> {
  res.render('purchase-guide')
})
route.get('/ecommerce', (req,res)=> {
  res.render('ecommerce-faq')
})
route.get('/terms', (req,res)=> {
  res.render('terms-conditions')
})
route.get('/watch', (req,res)=> {
  res.render('watch-main-layout')
})
route.get('/trend', (req,res)=> {
  res.render('trend-fashion')
})
route.get('/cart', (req,res)=> {
  res.render('shop-cart')
})
route.get('/wishlist', (req,res)=> {
  res.render('wishlist')
})
route.get('/track', (req,res)=> {
  res.render('track-order')
})
route.get('/privacy', (req,res)=> {
  res.render('privacy-policy')
})
route.get('/account', (req,res)=> {
  res.render('account')
})
route.get('/address', (req,res)=> {
  res.render('address')
})
route.get('/shop-cart', (req,res)=> {
  res.render('shop-cart')
})
route.get('/checkout', (req,res)=> {
  res.render('checkout')
})
route.get('/component', (req,res)=> {
  res.render('component')
})
route.get('/confirmation', (req,res)=> {
  res.render('confirmation')
})
route.get('/email-black', (req,res)=> {
  res.render('email-black')
})
route.get('/email-flash', (req,res)=> {
  res.render('email-flash')
})
route.get('/email-order', (req,res)=> {
  res.render('email-order')
})
route.get('/order-history', (req,res)=> {
  res.render('order-history')
})
route.get('/invoice', (req,res)=> {
  res.render('invoice')
})
route.get('/modern', (req,res)=> {
  res.render('modern')
})
route.get('/payment', (req,res)=> {
  res.render('payment')
})
route.get('/product-details', (req,res)=> {
  res.render('product-details')
})
route.get('/product-list-f', (req,res)=> {
  res.render('product-list-f')
})
route.get('/product-category', (req,res)=> {
  res.render('product-category')
})
route.get('/review', (req,res)=> {
  res.render('review')
})





route.get('/backends', (req,res)=> {
  res.render('accountb')
})
route.get('/account-settings', (req,res)=> {
  res.render('account-settings')
})
route.get('/brands', (req,res)=> {
  res.render('brands')
})
route.get('/categories', (req,res)=> {
  res.render('categories')
})
route.get('/calendar', (req,res)=> {
  res.render('calendar')
})
route.get('/coming-soon', (req,res)=> {
  res.render('coming-soon')
})
route.get('/coupons', (req,res)=> {
  res.render('coupons')
})
route.get('/currency', (req,res)=> {
  res.render('currency-rates')
})
route.get('/invoices-create', (req,res)=> {
  res.render('invoices-create')
})
route.get('/invoices-details', (req,res)=> {
  res.render('invoices-details')
})
route.get('/invoices-list', (req,res)=> {
  res.render('invoices-list')
})
route.get('/order-list', (req,res)=> {
  res.render('order-list')
})
route.get('/order-overview', (req,res)=> {
  res.render('order-overview')
})
route.get('/product-create', (req,res)=> {
  res.render('product-create')
})
route.get('/product-grid', (req,res)=> {
  res.render('product-grid')
})
route.get('/product-list', (req,res)=> {
  res.render('product-list')
})
route.get('/product-overview', (req,res)=> {
  res.render('product-overview')
})
route.get('/reviews-ratings', (req,res)=> {
  res.render('reviews-ratings')
})
route.get('/seller-overview', (req,res)=> {
  res.render('seller-overview')
})
route.get('/seller-grid-view', (req,res)=> {
  res.render('seller-grid-view')
})
route.get('/seller-list-view', (req,res)=> {
  res.render('seller-list-view')
})
route.get('/seller-list-view', (req,res)=> {
  res.render('seller-list-view')
})
route.get('/shipping-list', (req,res)=> {
  res.render('shipping-list')
})
route.get('/shipments', (req,res)=> {
  res.render('shipments')
})
route.get('/statistics', (req,res)=> {
  res.render('statistics')
})
route.get('/sub-categories', (req,res)=> {
  res.render('sub-categories')
})
route.get('/transactions', (req,res)=> {
  res.render('transactions')
})
route.get('/users-list', (req,res)=> {
  res.render('users-list')
})

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
