

const router = require('express').Router();
const classController = require('../controllers/classController');
const passport = require('passport');


// submitting form of create class
router.post('/createRoom', classController.createRoom);

// submittting form of join class
router.post('/join')

// enter classroom
router.get('/enter/:classid', passport.checkAuthentication, classController.enter) 

//update class details
router.post('/update/:classid', passport.checkAuthentication, classController.update);

//delete classroom
router.get('/delete/:classid', passport.checkAuthentication, classController.delete);

module.exports = router;