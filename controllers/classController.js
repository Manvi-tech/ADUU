
const Class = require('../model/class');
const User = require('../model/user');
const bcryptjs = require('bcryptjs');

//submiting create class form, and adding it into db
module.exports.createRoom = async function(req, res){

    const link = await bcryptjs.hash(req.body.classId, 10);

    const newClass = await Class.create({
        creator: req.user._id,
        className: req.body.className,
        subject: req.body.subject,
        section: req.body.section,
        classLink: link
    });

    const currentUser = await User.findById(req.user._id);

    await currentUser.classRooms.push(newClass);
    await currentUser.enrolledClasses.push(newClass);
    currentUser.save();

    return res.redirect('back');
    
}

// student joining class using a link
module.exports.join = async function(req, res){
    const link = req.body.classLink;
    const classroom = await Class.findOne({classLink: link});
    const currUser = req.user;

    if(classroom){
        const userEnrolled = false;
        for(i of classroom.students){
            if(i.id == currUser.id){
                userEnrolled = true;
                break;
            } 
        }

        if(!userEnrolled){
            classroom.students.push(currUser);
            currUser.enrolledClasses.push(classroom);
        }else{
            // show noti : already student of this class
        }
    }
    else{
        // display noti no such class exist, wrong link
    }

    return res.redirect('back');
}

// entering classroom where all details are there about that class
module.exports.enter = async function(req, res){
    const classroom = await Class.findById(req.params.classid)
    .populate('creator');

    return res.render('classroom', {
        classroom: classroom
    });
}

//updating class details
module.exports.update = async function(req, res){
    try{
        await Class.findByIdAndUpdate(req.params.classid, req.body);
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

// deleting class 
module.exports.delete = async function(req, res){
    try{
        //removing class from user's classrooms 
        let currUser = await User.findById(req.user._id);
        currUser.classRooms.pull(req.params.classid);
        currUser.save();

        //removing the class from students enrolled classes
        let delClass = await Class.findById(req.params.classid);
        for(i of delClass.students){
             let student = await User.findById(i._id);
             student.enrolledClasses.pull(req.params.classid);
             student.save();
        }

        // delete class
        delClass.remove();

        return res.redirect('back');

    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
