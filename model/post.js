
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    
    // post text info 
    postContent:{
        type: String,
        required: true
    },

    // teacher who posted
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // post is of which class
    postClass:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },

    // comments may be of students on that post
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
   
    // assignments or any other document
    postFiles:[
        {
            type: String
        }
    ]


},{
    timestamps: true
});

mongoose.model('Post', postSchema);
