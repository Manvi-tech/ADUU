

const router = require('express').Router();
const classController = require('../controllers/classController');
const passport = require('passport');

// submitting form of create class
router.post('/createRoom',passport.checkAuthentication, classController.createRoom);

// submittting form of join class through a link
router.post('/joinRoom', passport.checkAuthentication, classController.join);

// enter classroom where all info about class is present
router.get('/enter/:classid', passport.checkAuthentication, classController.enter) 

//update class details
router.post('/update/:classid', passport.checkAuthentication, classController.update);

// enter live class
router.get('/live/:roomid', passport.checkAuthentication, classController.liveClass);

//delete classroom
router.get('/delete/:classid', passport.checkAuthentication, classController.delete);

//student leave classroom
router.get('/leave/:classid', passport.checkAuthentication, classController.leaveClass);

module.exports = router;