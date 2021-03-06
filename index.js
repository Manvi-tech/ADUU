
const express = require('express');
const port = process.env.PORT || 9000;
const app = express();
const path = require('path');

const db = require('./config/mongoose');

require('./model/class');
require('./model/comment');
require('./model/post');
require('./model/user');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportGoogle = require('./config/passport-google-strategy');
const passportLocal = require('./config/passport-local-strategy');
const keys = require('./config/keys');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const socketServer = require('http').Server(app);
const Sockets = require('./config/sockets').Socket(socketServer);

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(socketServer, {
    debug: true
});

app.use('/peerjs', peerServer);

//to use req.body in forms data
app.use(express.urlencoded({extended:false}));


//to access ejs instead of html from views
const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(session({
    name: keys.session.name,
    secret: keys.session.cookieKey,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: keys.mongodb.url,
            ttl: 14 * 24 * 60 * 60 
        },
        function(err){
            console.log(err || 'connect mongo fine');
        } 
    )
    
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash()); //flash uses session cookies , therefore used after it
app.use(customMware.setFlash);

//accessing css,js
app.use(express.static(path.join(__dirname, 'assets')));

// all requests
app.use('/', require('./routes'));

socketServer.listen(port);


