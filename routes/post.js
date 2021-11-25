
const express = require('express');
const router = express.Router();
const passport= require('passport');
const postController = require('../controllers/postController');

// create post in class
router.post('/create/:classid', passport.checkAuthentication,postController.createPost);

// delete post
router.get('/delete/:postid', passport.checkAuthentication, postController.deletePost);


module.exports = router;