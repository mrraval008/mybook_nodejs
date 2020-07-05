const mongoose = require('mongoose');

const User = require('./UserModel')
const Post = require('./PostModel')


const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:[true,'A comment miust have content']
    },
    commentBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A comment must have User']
    },
    commentOn:{
        type:mongoose.Schema.ObjectId,
        ref:'Post',
        required:[true,'A comment must have post']
    },
    modifiedAt:{
        type:Date,
        default:Date.now()
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON:{virtuals:true},
    toJSON:{virtuals:true}
})


//Query Middleare
commentSchema.pre(/^find/,function(next){
    this.populate({
        path:'commentBy',
        select:'-__v'
    })
    next();
})






const commentModel = new mongoose.model('Comments',commentSchema,'comments')

module.exports = commentModel