

const Post = require('../model/post');
const Class = require('../model/class');

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


// module.exports.createPost =async function(req, res){
    
// }