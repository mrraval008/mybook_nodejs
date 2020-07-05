const mongoose = require('mongoose');
// const UserModel = require('../models/UserModel'); 
// const PostModel = require('../models/PostModel');

const likeModelSchema = new mongoose.Schema({
    likeType:{
        type:String,
        require:true,
        enum:{
            values:['like','love','haha','wow','sad'],
            message:"A like must have valye either of 'like','love','haha','wow','sad' "
        }
    },
    likedBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A like must have user']
    },
    
    likedOn:{
        type:mongoose.Schema.ObjectId,
        ref:'Post',
        required:[true,'A like must have post']
    }
 
})

likeModelSchema.pre(/^find/,function(next){
    this.populate({
        path:'likedBy',
        select : 'name'
    })

    next()
})


const likeModel = new mongoose.model('Like',likeModelSchema);

module.exports = likeModel