const Campground = require("../models/tourList");
const { cloudinary } = require("../CloudConfig/index");
const opencage = require("opencage-api-client");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
};
module.exports.newPlace = async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  const loc = await opencage
    .geocode({
      q: newCampground.location,
      key: process.env.OPENCAGE_API_KEY,
    })
    .then((data) => {
      const geometry = {
        type: "Point",
        coordinates: [
          data.results[0].geometry.lng,
          data.results[0].geometry.lat,
        ],
      };
      return geometry;
    });
  newCampground.geometry = loc;
  newCampground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.owner = req.user._id;
  await newCampground.save();
  console.log(newCampground);
  req.flash("success", "New campground added");
  res.redirect("/maketourList");
};
module.exports.showNew = async (req, res) => {
  res.render("campground/new");
};
module.exports.show = async (req, res) => {
  const foundPlace = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
      },
    })
    .populate("owner");
  if (!foundPlace) {
    req.flash("error", "Can't find that place");
    return res.redirect("/maketourList");
  }
  res.render("campground/details", { foundPlace });
};
module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find the place");
    return res.redirect("/maketourList");
  }
  res.render("campground/edit", { campground });
};
module.exports.update = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const UpdatedCampground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground
  );
  const img = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  UpdatedCampground.image.push(...img);
  await UpdatedCampground.save();
  if (req.body.deleteimg) {
    for (let filename of req.body.deleteimg) {
      await cloudinary.uploader.destroy(filename);
    }
    await UpdatedCampground.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteimg } } },
    });
  }
  req.flash("success", "Campground Updated");
  res.redirect(`${campground._id}`);
};
module.exports.deletePlace = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const toDeleteCampground = await Campground.findByIdAndDelete(id);
  res.redirect("/maketourList");
};
