const commentModel = require('../models/CommentModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')


const createComments = catchAsync(async(req,res,next)=>{

    let comment = await commentModel.create(req.body)

    if(!comment){
        let error = new AppError('Unable to Create Comment',501);
        next()
    }

    res.status(200).json({
        status:'success',
        data:comment
    })

})

const updateComments = catchAsync(async(req,res,next)=>{

    let comment = await commentModel.findByIdAndUpdate(req.params.id,req.body,{new:true});

    if(!comment){
        let error = new AppError("Not able to update comment",501);
        next(error);
    }

    res.status(200).json({
        status:"success",
        data:comment
    })
})

const getAllComments = catchAsync(async(req,res,next)=>{

    const comments = await commentModel.find();

    if(!comments){
        let error = new AppError("Not able to update comment",501);
        next(error);
    }


    res.status(200).json({
        status:"success",
        data:comments
    })
})


const getById = catchAsync(async(req,res,next)=>{

    const comment = await commentModel.findById(req.params.id);
    
    if(!comment){
        const error = new AppError("Not able to get comment",501)
        next(error)
    }

    res.status(200).json({
        status:'success',
        data:comment
    })

})

const deleteComments = catchAsync(async(req,res,next)=>{

    let comment = await commentModel.findByIdAndDelete(req.params.id)

    if(!comment){
        const error = new AppError("Not able to delete comment",501)
        next(error)
    }

    res.status(200).json({
        status:'success',
        data:null
    })
})

  




module.exports = {
    createComments,
    updateComments,
    getAllComments,
    getById,
    deleteComments
}