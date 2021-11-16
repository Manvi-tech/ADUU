
const User = require('../model/user');

//user posting signup form
module.exports.userSignUp = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user){
            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                googleId: Math.random()*3
            });
            return res.redirect('back');
       }else{
           //add flash message that user exists
            return res.redirect('back');
       }
    }catch(err){
       console.log(err);
    }
}


// user posting signin form
module.exports.userLogin = async function(req, res){
    return res.redirect('/user/profile');
}