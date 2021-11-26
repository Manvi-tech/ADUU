

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    
     commentContent:{
         type: String,
         required: true
     },

    // who created the comment
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // comment is on which post
    post:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Post',
       required: true  
    },

    // comment is on post of which class
    commentClass:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    }
   
},{
    timestamps: true
});

mongoose.model('Comment', commentSchema);
