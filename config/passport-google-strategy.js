
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const User = require('../model/user');
const crypto = require('crypto');

//passport is saving user id in cookie 
passport.serializeUser(function(user, done){
  return done(null, user.id);
})

//retrieving user by its id 
passport.deserializeUser(function(userid, done){
     User.findById(userid).then((user)=>{
        return done(null, user)
     });
})

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:9000/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    User.findOne({email: profile.emails[0].value}).then((currentUser) => {
      if(currentUser){
          console.log('user exists already with this email: ', currentUser);
          currentUser.googleId = profile.id;
          currentUser.save();
          return done(null, currentUser);
          //calls serialize user
          
      } else {
          new User({
            userName: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: crypto.randomBytes(20).toString('hex')
          }).save().then((newUser) => {
              console.log('created new user: ', newUser);
              return done(null, newUser);
          });
      }
    });
  }
));


module.exports = passport;