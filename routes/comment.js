

const express = require('express');
const passport = require('passport');
const router = express.Router();
const commentController = require('../controllers/commentController');

// creating comment
router.post('/create/:postid', passport.checkAuthentication, commentController.createComment)

module.exports= router;