const express = require('express');
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/tourList');
const app = express();
const { places, descriptors } = require('./seederHelper')
const axios = require('axios');
mongoose.connect('mongodb://127.0.0.1:27017/tour-list')
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.log(e);
    })
const rand = Math.floor(Math.random() * 150);
const URL = `https://api.unsplash.com/collections/1376658/photos/?client_id=QSVMh-4txQP-y_L7VPMGfnBw0m4NVHoOw-Y82McFytA&page=${rand}`;
async function getImage() {
    const res = await axios.get(URL)
        .then((data) => {
            const r = Math.floor(Math.random() * 10);
            const src = data.data[r].urls.regular;
            return src;
        })
    return res;
}
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 60; i++) {
        const src = await getImage();
        const randomCity = Math.floor(Math.random() * 528);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: { url: `${src}` },
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis corrupti ab quas vero quos nisi sapiente voluptatem praesentium deleniti esse ex id dolores rem est vel voluptates perferendis, illo delectus!",
            price: price,
            owner: '65d35e270fc25478e764d79f',
        })
        console.log(camp.image);
        await camp.save();
    }
}

seedDB();   