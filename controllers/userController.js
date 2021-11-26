
const mongoose= require('../config/mongoose')
const User = mongoose.model('User');

module.exports.profile = async function(req, res){

    let currUser = await User.findById(req.user._id)
    .populate('classRooms')
    .populate({
        path: 'enrolledClasses',
        populate: 'creator'
    });

    return res.render('profile',{
        loggedInUser: currUser,
        title: 'EduLive | Profile'
    });
}