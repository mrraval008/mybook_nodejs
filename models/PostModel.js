const mongoose = require('mongoose');

const User = require('./UserModel')
const LikeModel = require('./LikeModel');


let postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'A post must have content'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    },
    images: {
        type: [String]
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A post must have user']
    }
}, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


postSchema.virtual('likes', {
    ref: "Like",
    foreignField: 'likedOn',
    localField: "_id"
})


postSchema.virtual('comments',{
    ref:'Comments',
    foreignField:"commentOn",
    localField:"_id"
})

//Query middleware
postSchema.pre(/^find/, function (next) {

    this.populate({
        path: 'createdBy',
        select: '-__v'   //dont show __v in result
    })
    next()
})
postSchema.pre(/^find/, function (next) {

    this.populate({
        path: 'likes',
        select: '-__v'   //dont show __v in result
    })
    next()
})

postSchema.pre(/^find/,function(next){
    this.populate({
        path:'comments',
        select:'-__v'
    })
    next()
})


const PostModel = new mongoose.model('Post', postSchema, 'posts')   //third argument is the name of collection

module.exports = PostModel