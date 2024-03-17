const Campground = require('../models/tourList');
const Review = require('../models/review')
module.exports.create = async (req, res) => {
    const place = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Review Added Successfully ! ')
    res.redirect(`/maketourList/${place.id}`);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const updatedCList = Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('error', "review Deleted :(")
    res.redirect(`/maketourList/${id}`);
}