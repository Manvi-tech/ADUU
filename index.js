
const express = require('express');
const port = 9000;
const app= express();
const path = require('path');
const cookieSession = require('cookie-session');
const db = require('./config/mongoose');
const passport = require('passport');
const passportGoogle = require('./config/passport-google-strategy');
const passportLocal = require('./config/passport-local-strategy');
const keys = require('./config/keys');

//to use req.body in forms data
app.use(express.urlencoded({extended:false}));

//to access ejs instead of html from views
const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//encrypting user info in cookies
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys:[keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//accessing css,js
app.use(express.static(path.join(__dirname, 'assets')));

// all requests
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){console.log('error', err); return;}
    else{console.log('server is up and running on port: ', port);}
});


