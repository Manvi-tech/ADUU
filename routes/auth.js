
//logging in using google, facebook, manually

const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// render accountlogin or signup page
router.get('/loginPage', function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    else{
        return res.render('accountLogin');
    }
});

//signing up using email, password
router.post('/signup', authController.userSignUp);

//signing in using email and password
router.post('/login', passport.authenticate(
    'local',
    {
        failureRedirect: '/auth/loginPage'
    }
 ), authController.userLogin);

//signing up and logging in using gmail
router.get('/google', passport.authenticate('google',{
    scope: ['profile']
}));

//after logging in through google, we need profile info of user using passport
router.get('/google/redirect',
    passport.authenticate('google'), 
    (req, res) => {
    return res.redirect('/user/profile');
});

//signing out
router.get('/logout', function(req, res){
    req.logout();
    return res.redirect('/');
});

module.exports = router;