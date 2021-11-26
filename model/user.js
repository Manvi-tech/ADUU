
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required: true
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

mongoose.model('User', userSchema);
