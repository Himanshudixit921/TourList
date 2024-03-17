const express = require('express');
const router = express.Router();
const Campground = require('../models/tourList')
const { index, newPlace, showNew, show, edit, update, deletePlace } = require('../controller/tourList')
const wrapAsync = require('../Helper/wrapAsync');
const ExpressError = require('../Helper/expresserr')
const { loginValidation } = require('../Helper/loginValidation')
const { tourListSchema, reviewSchema } = require('../Helper/middlewareError')
const multer = require('multer')
const { storage } = require('../CloudConfig/index')
const upload = multer({ storage });
const validateTourList = (req, res, next) => {
    const result = tourListSchema.validate(req.body);
    if (result.error) {
        const errorDisplay = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(errorDisplay, 400);
    } else {
        next();
    }
}
const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.owner.equals(req.user._id)) {
        req.flash('error', "You are not authorized");
        return res.redirect(`/maketourList/${id}`)
    }
    next();
}
router.get('/', wrapAsync(index));
router.post('/', loginValidation, upload.array('image'), validateTourList, wrapAsync(newPlace));
// router.post('/', upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("It worked");
// })
router.get('/new', loginValidation, showNew)
router.get('/:id', wrapAsync(show))
router.get('/:id/edit', loginValidation, isOwner, wrapAsync(edit))
router.put('/:id', loginValidation, upload.array('image'), validateTourList, isOwner, wrapAsync(update))
router.delete('/:id', loginValidation, isOwner, wrapAsync(deletePlace))
module.exports = router;