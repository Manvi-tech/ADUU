
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    
    // teacher who posted
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // post is of which class
    class:{
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

const Post = mongoose.model('Post', postSchema);
module.exports = Post;