const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const option = { toJSON: { virtuals: true } };
const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const CampgroundSchema = new Schema(
  {
    description: String,
    image: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    title: String,
    price: Number,
    location: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  option
);
CampgroundSchema.virtual("properties.popuptext").get(function () {
  return `<a href="/maketourList/${this._id}">${this.title}</a>`;
});
CampgroundSchema.post("findOneAndDelete", async function (item) {
  if (item) {
    await Review.deleteMany({
      _id: {
        $in: item.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
