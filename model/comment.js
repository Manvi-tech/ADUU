

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    
    // who created the comment
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // comment is on which post
    post:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Post'  
    },

    // comment is on post of which class
    class:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }
   
},{
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;