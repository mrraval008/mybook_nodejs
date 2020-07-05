const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


const likeModel  = require('../models/LikeModel');

const getAllLikes = catchAsync( async (req,res,next)=>{
    const likes = await likeModel.find();
    if(!likes){
        return next(new AppError("Not able to find likes",404));
    }

    res.status(200).json({
        status:'success',
        data:likes
    })
})

const createLike = catchAsync( async(req,res,next)=>{
        const _reqBody = req.body;
        const like = await likeModel.create(_reqBody);

        if(!like){
            return next(new AppError("Unable to create like","404"));
        }

        return res.status(200).json({
            status:'success',
            data:like
        })
})

const deleteLike = catchAsync( async(req,res,next)=>{
    const id = req.params.id;
    const like = await likeModel.findByIdAndDelete(id);

    if(!like){
        return next(new AppError(`Like not found with this id ${id}`,404));
    }

    return res.status(200).json({
        status:'success',
        data:null
    })
})

const updateLike = catchAsync( async (req,res,next)=>{
    const id = req.params.id;
    const _reqBody = req.body;
    
    const like = await likeModel.findByIdAndUpdate(id,_reqBody,{new :true});
    if(!like){
        return next(new AppError(`Unable to update like with id ${id}`,404));
    }

    return res.status(200).json({
        status:'success',
        data:like
    })
})

module.exports = {
    createLike,
    deleteLike,
    updateLike,
    getAllLikes
}