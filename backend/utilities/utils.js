const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
require("dotenv").config();

exports.generateFileName = (mimetype) => {
  const mediaName = crypto.randomBytes(32).toString("hex");
  const ext = mimetype.split("/")[1];
  return `${mediaName}.${ext}`;
};

exports.uploadBucket = (gridbucketName) => {
  // Create a MongoDB connection
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;

  // Set up multer for handling file uploads
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // Create a GridFSBucket for file storage
  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: gridbucketName,
  });
  // Allowed files type
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/mpeg"];
  return {
    upload,
    bucket,
    allowedImageTypes,
    allowedVideoTypes,
    gridbucketName,
    db,
  };
};
