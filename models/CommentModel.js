const mongoose = require('mongoose');

const User = require('./UserModel')
const Post = require('./PostModel')


const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:[true,'A comment miust have content']
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A comment must have User']
    },
    createdOn:{
        type:mongoose.Schema.ObjectId,
        ref:'Post',
        required:[true,'A comment must have post']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})



//Query Middleare
commentSchema.pre(/^find/,function(next){
    this.populate({
        path:'createdBy',
        select:'-__v'
    })
    next();
})

const commentModel = new mongoose.model('Comments',commentSchema,'comments')

module.exports = commentModel