
const mongoose = require('mongoose');
const keys= require('./keys');

mongoose.connect(keys.mongodb.url);

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'error connecting to db!'));
db.once('open', function(){
    console.log('successfully connected to mongo db!');
});

module.exports=db;