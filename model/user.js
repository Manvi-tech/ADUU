
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String,
    },
    googleId: {
        type: String
    },
    classRooms:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    enrolledClasses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
   
},{
    timestamps:true
});

const User = mongoose.model('User', userSchema);
module.exports = User;