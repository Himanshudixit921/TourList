const express = require("express");
const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/tourList");
const app = express();
const { places, descriptors } = require("./seederHelper");
const db_url =
  "mongodb+srv://himanshudixit921:R9tEZ1dFchu9MnRf@cluster0.4jvatox.mongodb.net/";
const axios = require("axios");
mongoose
  .connect(db_url)
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });
const rand = Math.floor(Math.random() * 150);
const URL = `https://api.unsplash.com/collections/1376658/photos/?client_id=QSVMh-4txQP-y_L7VPMGfnBw0m4NVHoOw-Y82McFytA&page=${rand}`;
async function getImage() {
  const res = await axios.get(URL).then((data) => {
    const r = Math.floor(Math.random() * 10);
    const src = data.data[r].urls.regular;
    return src;
  });
  return res;
}
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const src1 = await getImage();
    const src2 = await getImage();
    const src3 = await getImage();
    const randomCity = Math.floor(Math.random() * 528);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [{ url: `${src1}` }, { url: `${src2}` }, { url: `${src3}` }],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis corrupti ab quas vero quos nisi sapiente voluptatem praesentium deleniti esse ex id dolores rem est vel voluptates perferendis, illo delectus!",
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomCity].longitude,
          cities[randomCity].latitude,
        ],
      },
      price: price,
      owner: {
        _id: "6607e93837f5d417e62d55dc",
        email: "test@gmail.com",
        username: "test",
        __v: 0,
      },
    });
    await camp.save();
  }
};

seedDB();
