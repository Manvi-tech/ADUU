
const express = require('express');
const router = express.Router();
const passport= require('passport');
const postController = require('../controllers/postController');

// posting post-form data
router.post('/create/:classid', passport.checkAuthentication,postController.createPost);

module.exports = router;