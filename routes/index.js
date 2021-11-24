
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/',homeController.home);

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/class', require('./class'));

router.get('/live-board', (req, res)=> {
    return res.render('board',{
        title: 'jcsj'
    });
});

module.exports = router;