

const Comment = require('../model/comment');
const Post = require('../model/post');

// creating comment, adding it to post of class
module.exports.createComment = async function(req, res){
    try{
        
        const post = await Post.findById(req.params.postid);
        if(post){
            const newComment = await Comment.create({
                creator: req.user._id,
                post: req.params.postid,
                commentClass: post.postClass,
                commentContent: req.body.commentContent
            });
  
            post.comments.push(newComment);
            post.save();
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