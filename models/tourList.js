const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const ImageSchema = new Schema({
    url: String,
    filename: String,
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const CampgroundSchema = new Schema({
    description: String,
    image: [
        ImageSchema
    ],
    title: String,
    price: Number,
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review',
        }
    ]
})
CampgroundSchema.post('findOneAndDelete', async function (item) {
    if (item) {
        await Review.deleteMany({
            _id: {
                $in: item.reviews
            }
        })
    }


})
module.exports = mongoose.model('Campground', CampgroundSchema);