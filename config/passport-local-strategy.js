
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../model/user');


passport.serializeUser(function(user, done){
    return done(null, user.id);
  })
  
//retrieving user by its id 
passport.deserializeUser(function(userid, done){
    User.findById(userid).then((user)=>{
        return done(null, user)
    });
})

passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
function(req, email, password, done){
    User.findOne({email: email}, function(err, user){
        if(err){
            // req.flash('error', err);
            // console.log('err in finding user in passport!');
            return done(err);
        }
        if(!user || user.password != password){
            // req.flash('error', 'Invalid username or Password!');
            return done(null, false);
        }
        if(user){
            return done(null, user);
            //returning user to serializer to put it in cookie
        }
    }) 
}
));


//middleware to check if user is logged in
passport.checkAuthentication = function(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  return res.redirect('/user/signin');
}

//req.user contains current signed in user,setting user in locals for views to access
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport; 
