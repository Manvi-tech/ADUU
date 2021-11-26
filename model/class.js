
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    className:{
        type: String,
        required: true
    },
    classLink:{
        type: String,
        unique: true
    },
    roomId:{
       type: String,
       unique: true
    },
    section:{
       type: String
    },
    subject:{
        type: String
    },
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]

});

 mongoose.model('Class', classSchema);
