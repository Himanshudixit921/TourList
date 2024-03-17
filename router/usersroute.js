const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../Helper/wrapAsync');
const passport = require('passport');
const { loginRedirection } = require('../Helper/LoginRedirection')
const { register, registerPost, login, loginPost, logout } = require('../controller/userController')

router.get('/register', register)
router.post('/register', wrapAsync(registerPost))
router.get('/login', login)
router.post('/login', loginRedirection, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginPost)
router.get('/logout', logout)
module.exports = router;