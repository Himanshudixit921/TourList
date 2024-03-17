const express = require('express');
const wrapAsync = require('../Helper/wrapAsync')
const Campground = require('../models/tourList')
const Review = require('../models/review')
const { create, deleteReview } = require('../controller/reviewController')
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../Helper/middlewareError');
const { loginValidation } = require('../Helper/loginValidation');
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const errorDisplay = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(errorDisplay, 400);
    } else {
        next();
    }
}
const isOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.owner.equals(req.user._id)) {
        req.flash('error', "You are not authorized");
        return res.redirect(`/maketourList/${id}`)
    }
    next();
}
router.post('/', loginValidation, validateReview, wrapAsync(create))
router.delete('/:reviewId', loginValidation, isOwner, wrapAsync(deleteReview))
module.exports = router