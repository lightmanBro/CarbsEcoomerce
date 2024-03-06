const route = require("express").Router();
// const Post = require("../models/posts");
const User = require("../models/user");


function buildQuery(queryParams) {
  const query = {};

  if (queryParams.bedrooms) {
    query.bedrooms = queryParams.bedrooms;
  }
  if (queryParams.priceMin || queryParams.priceMax) {
    query.price = {};
    if (queryParams.priceMax) query.price.$gte = queryParams.priceMax;
    if (queryParams.priceMin) query.price.$lte = queryParams.priceMin;
  }
  if (queryParams.propertyType) query.propertyType = queryParams.propertyType;
  if (queryParams.bathrooms)
    query["bathrooms.count"] = { $gte: queryParams.bathrooms };
  if (queryParams.bedrooms)
    query["bedrooms.count"] = { $gte: queryParams.bedrooms };

  return query;
}

//Find House posted by filter
route.get("/post/filter", async (req, res) => {
  try {
    const query = buildQuery(req.query);

    // Adjust the sorting criteria to prioritize promotions: gold, silver, others
    const posts = await Post.find(query).sort({
      promotion: { $in: ["gold", "silver", "regular", "none"] },
      createdAt: -1,
    });
    res
      .status(200)
      .send({ status: "Success", total: posts.length, data: posts });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
});

route.get("/post/find?", async (req, res) => {
  try {
    // Extract filter parameters from the request
    const {
      area,
      location,
      status,
      state,
      propertyPurpose,
      propertyType,
      listedBy,
      professionalType,
    } = req.query;

    // Dynamic query object based on the provided filters
    let query = {};
    let postModel;
    let found;

    if (area) query.area = area;
    if (location) query.location = location;
    if (status) query.status = status;
    if (state) query.state = state;
    if (propertyPurpose) query.propertyPurpose = propertyPurpose;
    if (listedBy) query.listedBy = listedBy;

    if (professionalType) {
      query.professionalType = professionalType;
      sortCriteria = { followers: -1, ratings: -1 };
      found = await User.find(query).sort(sortCriteria);
    } else if (propertyType) {
      switch (propertyType) {
        case "Commercial Property":
          postModel = CommercialProperty;
          break;
        case "New Build":
          postModel = NewBuild;
          break;
        case "Event Centers":
          postModel = EventCenter;
          break;
        case "Venues":
          postModel = Venues;
          break;
        case "Work Station":
          postModel = WorkStation;
          break;
        case "Lands and Plots":
          postModel = LandAndPlots;
          break;
        case "House and Apartments":
          postModel = HousesAndApartment;
          break;
        case "Short Let Property":
          postModel = ShortLetProperty;
          break;
        default:
          res.status(404).send("Invalid propertyType");
          return;
      }
      found = await postModel.find(query).sort({
        //   promotion: { $in: ["gold", "silver", "regular", "none"] },
        createdAt: -1,
      });
    }

    res
      .status(200)
      .send({ status: "Success", total: found.length, data: found });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
});

module.exports = route;
