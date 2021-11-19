
const User = require('../model/user');

//user posting signup form
module.exports.userSignUp = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user){
            await User.create({
                username: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                googleId: Math.random()*3
            });
            req.flash('success', 'user signed up successfully');
            return res.redirect('/user/profile');
       }else{
           //add flash message that user exists
           req.flash('error', 'user already exists');
            return res.redirect('back');
       }
    }catch(err){
       console.log(err);
    }
}


// user posting signin form
module.exports.userLogin = async function(req, res){
    req.flash('success', 'user signed in');
    return res.redirect('/user/profile');
}