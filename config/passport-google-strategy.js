
const passport = require('passport');
const crypto = require('crypto');
const googleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../model/user');

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

passport.use(
  new googleStrategy({
      // options for google strategy
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: '/auth/google/redirect'

  }, (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      User.findOne({googleId: profile.id}).then((currentUser) => {
          if(currentUser){
              // already have this user
              console.log('user is: ', currentUser);
              return done(null, currentUser);
              //calls serialize user
              
          } else {
              // if not, create user in our db
              new User({
                name: profile.displayName,
                googleId: profile.id,
                password: crypto.randomBytes(20).toString('hex')
              }).save().then((newUser) => {
                  console.log('created new user: ', newUser);
                  return done(null, newUser);
                  //calls serialize user
              });
          }
      });
  })
);

module.exports = passport;
