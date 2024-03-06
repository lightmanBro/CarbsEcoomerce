const { generateFileName, uploadBucket } = require("../utilities/utils");
const { Product, Brand, Category, Subcategory } = require("../models/item");
const { bucket, allowedImageTypes } = uploadBucket("Post-media-files");

exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    // Retrieve the existing item by ID
    const existingItem = await Product.findById(itemId);

    if (!existingItem) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Item not found" });
    }
    // Handle media file uploads
    if (req.files && req.files.length > 0) {
      // Delete existing picture from storage bucket if it exists
      if (existingItem.mediaFilesPicture) {
        // Find the file by filename and delete it
        existingItem.mediaFilesPicture.forEach(async pic=>{
          await bucket.delete(existingItem.companyLogo); // Implement this function to delete the file from the storage bucket
        })
      }
      for (const file of req.files) {
        const { mimetype, buffer } = file;
        const newFileName = generateFileName(mimetype);

        if (allowedImageTypes.includes(mimetype)) {
          const uploadStream = bucket.openUploadStream(newFileName, {
            contentType: mimetype,
          });
          uploadStream.end(buffer);
          // Associate the new file with the item
          existingItem.mediaFilesPicture.push(newFileName);
        }
      }
    }

    // Apply the rest of the updates
    Object.assign(existingItem, ...req.body);

    // Save the updated item with new media files
    await existingItem.save();
    res.status(200).json(existingItem);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.updateBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
    const existingBrand = await Brand.findById(brandId);
    if (!existingBrand)
      return res.status(404).json({ status: "Failed", message: "Brand not found" });

    // Handle media file uploads
    if (req.files && req.files.length > 0) {
      // Delete existing picture from storage bucket if it exists
      if (existingBrand.companyLogo) {
        // Find the file by filename and delete it
        await bucket.delete(existingBrand.companyLogo); // Implement this function to delete the file from the storage bucket
        existingBrand.companyLogo = '';
      }
      for (const file of req.files) {
        const { mimetype, buffer } = file;
        const newFileName = generateFileName(mimetype);

        if (allowedImageTypes.includes(mimetype)) {
          const uploadStream = bucket.openUploadStream(newFileName, {
            contentType: mimetype,
          });
          uploadStream.end(buffer);
          // Associate the new file with the item
          existingBrand.companyLogo = newFileName;
        }
      }
    }
    // Update other fields if needed
    Object.assign(existingBrand, req.body);
    // Save the updated brand document
    await existingBrand.save();
    res.status(200).json({ status: "Success", message: "Brand updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};



exports.updateCategory= async function(req,res){
  const {_id,title,description} = req.body
  console.log(req.body)
  try {
    const update = await Category.findByIdAndUpdate(_id.trim(),{title,description});
    await update.save();
    res.status(200).json({status:'Success'});
  } catch (error) {
    res.status(500).send(error.message);
  }
}

exports.subCategoryUpdate = async function(req,res){
  const {_id,title, description, category} = req.body;
  try {
    const update = await Subcategory.findByIdAndUpdate(_id,{title,description,category})
  } catch (error) {
    res.status(500).send(error.message);
  }
}