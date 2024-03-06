const mongoose = require("mongoose");

const { uploadBucket } = require("../utilities/utils");

const { bucket, gridbucketName, db } = uploadBucket("Post-media-files");
const { Product, Brand } = require("../models/item");

exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;
  let item;

  try {
    item = await Product.findById(itemId);

    if (!item) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Item not found" });
    }

    if (req.user.role === "Admin" || req.user.role === "Support") {
      // Delete associated media files from GridFSBucket
      const getFileIdByFileName = async (fileName) => {
        const file = await db
          .collection(`${gridbucketName}.files`)
          .findOne({ filename: fileName });
        return file ? file._id : null;
      };

      const mediaFilesIds = item.mediaFilesPicture;

      for (const fileName of mediaFilesIds) {
        const fileId = await getFileIdByFileName(fileName);

        if (fileId) {
          await bucket.delete(new mongoose.Types.ObjectId(fileId));
          console.log(`File with ID ${fileId} deleted.`);
        } else {
          console.log(`File with name ${fileName} not found.`);
        }
      }
      // Delete the item from the database
      await itemModel.findByIdAndDelete(itemId);
    } else {
      res.status(403).json({ status: "Failed", message: "Aunothorized" });
    }
    // Retrieve the item by ID

    res.status(200).send({
      status: "Success",
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteBrand = async (req, res) => {
  const brandId = req.params.id;

  try {
    const brand = await Brand.findOne({ _id: brandId });

    if (!brand) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Brand not found" });
    }

    if (req.user.role === "Admin" || req.user.role === "Support") {
      // Delete the brand from the database
      await Brand.findByIdAndDelete(brandId);
    } else {
      res.status(403).json({ status: "Failed", message: "Aunothorized" });
    }

    res
      .status(200)
      .json({ status: "Success", message: "Brand deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};
