

const Comment = require('../model/comment');
const Post = require('../model/post');

// creating comment, adding it to post of class
module.exports.createComment = async function(req, res){
    try{
        // post on which comment is made
        var commentPost = await Post.findById(req.params.postid);
        
        if(commentPost){
            const newComment = await Comment.create({
                creator: req.user._id,
                post: req.params.postid,
                commentClass: commentPost.postClass._id,
                commentContent: req.body.commentContent
            });
  
            commentPost.comments.push(newComment);
            commentPost.save();
            req.flash('success', 'comment published');
            return res.redirect('back');
  
        }else{
            req.flash('error', 'unable to create comment');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', 'unable to create comment');
        return res.redirect('back');
    }
}