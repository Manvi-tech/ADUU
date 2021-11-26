
const mongoose= require('../config/mongoose')
const Comment = mongoose.model('Comment');
const Post = mongoose.model('Post');

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
  
            // adding comment to the post comments array
            commentPost.comments.push(newComment);
            commentPost.save();

            req.flash('success', 'comment published');
            return res.redirect('back');
  
        }else{
            // post on which comment is made doesnt exit
            req.flash('error', 'unable to create comment');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', 'unable to create comment');
        return res.redirect('back');
    }
}


// deleting comment
module.exports.deleteComment = async function(req, res){
    
    try{

        const comment = await Comment.findById(req.params.commentId);
        if(comment){
             
            const post = await Post.findById(comment.post);
            if(post){
                // remove comment from array of post on which comment is made
                post.comments.pull(comment.id);
                post.save();
            }

            // remove comment from Comment schema
            comment.remove();

            req.flash('success', 'comment deleted');
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