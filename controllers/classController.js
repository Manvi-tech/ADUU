
const Class = require('../model/class');
const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

//submiting create class form, and adding it into db
module.exports.createRoom = async function(req, res){

    const link = await bcryptjs.hash(req.body.classId, 10);
    const currentUser = await User.findById(req.user._id);

    const newClass = await Class.create({
        creator: currentUser,
        className: req.body.className,
        subject: req.body.subject,
        section: req.body.section,
        classLink: link,
        roomId: uuidv4()
    });

    await currentUser.classRooms.push(newClass);
    // await currentUser.enrolledClasses.push(newClass);
    currentUser.save();

    return res.redirect('/user/profile');
    
}

// student joining class using a link
module.exports.join = async function(req, res){
    const link = req.body.classLink;
    const classroom = await Class.findOne({classLink: link});
    const currUser = await User.findById(req.user._id);
    
    if(classroom){
        const userEnrolled = false;
       
        for(i of classroom.students){
            // checking if user already present inside the class
            if(i.id == currUser.id){
                userEnrolled = true;
                console.log('2')
                break;
            } 
        }

        if(userEnrolled){
             // already student of this class
             req.flash('error', 'already in this class');
        }else{
            await classroom.students.push(currUser);
            classroom.save();
            await currUser.enrolledClasses.push(classroom);
            currUser.save();
        }
    }else{
        // no such class exist, wrong link
        req.flash('error', 'no class with this link exists');
    }

    return res.redirect('back');
}

// entering classroom where all details are there about that class
module.exports.enter = async function(req, res){
    const classroom = await Class.findById(req.params.classid)
    .populate('creator')
    .populate('students');

    return res.render('classroom', {
        classroom: classroom,
        title: 'EduLive|Classroom'
    });
}

//joining a live class
module.exports.liveClass = async function(req, res){
    try{
        const classroom = await Class.findOne({roomId: req.params.roomid});
        const user = await User.findById(req.user._id);

        return res.render('onlineClass', {
            roomId: req.params.roomid,
            userId: user.id,
            userName: user.username,
            userEmail: user.email,
            title: 'EduLive | Live Class'
        });
    }catch(err){
        req.flash('error', err);
        console.log(err);
        return res.redirect('back');
    }
}

// exiting live class
module.exports.exitLiveClass = async function(req, res){
    try{
        const classroom = await Class.findOne({roomId: req.params.roomid});
        return res.redirect('/user/profile');
        
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
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

// teacher deleting class 
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

//student leaving class
module.exports.leaveClass = async function(req, res){
    try{
        const classroom = await Class.findById(req.params.classid);
        const user = await User.findById(req.user._id);
        
        if(classroom){
             // removing student from studenst of classroom
            let student = await Class.findByIdAndUpdate(classroom.id, { $pull: {students : user.id}});

            // removing class from enrolled classes of student
            let enrClass = await User.findByIdAndUpdate(user.id, { $pull: {enrolledClasses: classroom.id}});
            
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }

    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
