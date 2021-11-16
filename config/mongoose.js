
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/online_education_db');

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'error connecting to db!'));
db.once('open', function(){
    console.log('successfully connected to mongo db!');
});

module.exports=db;