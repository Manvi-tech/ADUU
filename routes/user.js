
const router = require('express').Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// after logging in, user is directed to profile page
router.get('/profile',passport.checkAuthentication, userController.profile);


module.exports = router;