
const mongoose= require('../config/mongoose');
const Post = mongoose.model('Post');
const Class = mongoose.model('Class');
const Comment = mongoose.model('Comment');

// post created in classroom
module.exports.createPost = async function(req, res){

      try{
           const classroom = await Class.findById(req.params.classid);
           if(classroom){
              const newPost = await Post.create({
                   postContent: req.body.postContent,
                   creator: req.user._id,
                   postClass: classroom.id
               });
               classroom.posts.push(newPost);
               classroom.save();

               req.flash('success', 'successfully posted');
               return res.redirect('back');

           }else{
               return res.redirect('back');
           }
      }catch(err){
         console.log(err);
         return res.redirect('back');
      }

}

module.exports.deletePost =async function(req, res){
    try{
         const post = await Post.findById(req.params.postid);
         const postClass = await Class.findById(post.postClass._id);
        
         //  remove this post from array of posts of class
            postClass.posts.pull(post.id);
            postClass.save();

         //  remove comments of post
          await Comment.deleteMany({post: post._id}); 

         // remove post
            post.remove();
            req.flash('success', 'post deleted');

         return res.redirect('back');

    }catch(err){
        console.log(err);
        req.flash('error', 'unable to delete post')
        return res.redirect('back');
    }
}

