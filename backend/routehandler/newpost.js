const { Product, Brand, Category, Subcategory } = require("../models/item");

const { generateFileName, uploadBucket } = require("../utilities/utils");

const { bucket, allowedImageTypes } = uploadBucket("Item-media-files");

exports.newBrand = async (req, res) => {
  const brandName = req.body.brandName;
  console.log(req.files);
  try {
    // console.log(brandName,req.files)
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("No files were uploaded...");
    }
    const newBrand = new Brand({ brandName });

    const file = files[0];
    const { mimetype, buffer } = file;
    const fileName = generateFileName(mimetype);

    if (allowedImageTypes.includes(mimetype)) {
      const uploadStream = bucket.openUploadStream(fileName, {
        contentType: mimetype,
      });

      uploadStream.end(buffer);
      // Associate the file with the item
      newBrand.companyLogo = fileName;
    } else {
      console.error(`Invalid file type: ${mimetype}`);
      // Optionally, you can choose to reject the file or handle it differently
    }
    await newBrand.save();
    res.status(200).send({ status: "Success", message: newBrand });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.newCategory = async (req, res) => {
  const { title, description } = req.body;
  console.log(req.body);
  try {
    if (!title || !description) {
      return res.status(400).send("One or more field cannot be empty");
    }
    const newCategory = new Category({ ...req.body });
    await newCategory.save();
    res.status(201).send({ status: "Created category", data: newCategory });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.newSubCategory = async (req, res) => {
  const { title, description, category } = req.body;
  console.log("from subcategory", title);
  try {
    if (!title || !description || !category) {
      return res.status(400).send({
        status: "Failed",
        message: "One or more fields cannot be empty",
      });
    }
    const itemId = await Subcategory.find().count() + 1;
    const newSubCategory = new Subcategory({id:`#TBSC${itemId}`, title, description, category });
    await newSubCategory.save();
    res
      .status(201)
      .send({ status: "Success", message: "Subcategory created successfully" });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res
      .status(500)
      .send({ status: "Failed", message: "Internal server error" });
  }
};

exports.newItem = async (req, res) => {
  try {
    console.log(req.body,'The new item route hit');
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .send(
          "No files were uploaded. You cannot create a new item without pictures"
        );
    }
    const files = req.files;
    const findId = await Product.find().count();
    const { ...postData } = req.body;
    postData.findId = `#IT${findId+1}`
    postData.id = findId+1;
    // 1) Create the new item with the data
    const newPost = await Product.create({
      ...postData,
    });
    newPost.save();
    // 2) Upload the media files of the item
    const promises = files.map(async (file) => {
      const { mimetype, buffer } = file;
      const fileName = generateFileName(mimetype);
      if (allowedImageTypes.includes(mimetype)) {
        const uploadStream = bucket.openUploadStream(fileName, {
          contentType: mimetype,
        });
        uploadStream.end(buffer);
        // Associate the file with the item
        newPost.mediaFilesPicture.push(fileName);
      } else {
        res.status(400).send({ error: `Invalid file type: ${mimetype}` });
        // Optionally, you can choose to reject the file or handle it differently
      }
    });

    // No need for notifyFollowers function in this example

    await Promise.all(promises);

    res.status(201).send({
      message: "Post created successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
