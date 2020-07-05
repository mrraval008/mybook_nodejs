const UserModel = require('../models/UserModel');
const ChatRoomModel = require('../models/ChatRoomModel');
const catchAsync = require('../utils/catchAsync');
const APIFeature = require('../utils/apiFeature');
const AppError = require('../utils/appError');

const getAllUsers = catchAsync(async(req,res,next)=>{
    let DBQuery = UserModel.find();
    let apiFeatureReq = new APIFeature(DBQuery, req.query).filter().sort().limitFields().pagination()
    const users = await apiFeatureReq.DBQuery;
    if (!users) {
        const err = new AppError('Error in Finding Users', "404")
        return next(err);
    }
    return res.status(200).json({ status: 'success', data: users });
})

const getUser = catchAsync(async (req,res,next)=>{
        const slug = req.params.slug;
        
        const userData = await UserModel.find({slug});

        if(!userData){
            const err = new AppError('Error in Finding User', "404")
            return next(err);
        }

        return res.status(200).json({
            status:'success',
            data:userData
        })
})

const updateUser = catchAsync( async(req,res,next)=>{
        const slug = req.params.slug;
        const _reqBody = req.body;
        console.log("_reqBody",_reqBody)
        const user = await UserModel.findOneAndUpdate({slug},_reqBody,{new :true})

        if(!user){
            const err = new AppError('Error in Updating User', "404")
            return next(err);
        }

        
        return res.status(200).json({
            status:'success',
            data:user
        })

})

const getChatRoom = catchAsync( async (req,res,next)=>{

    // let roomName = req.params.roomName;

    let DBQuery = ChatRoomModel.find();
    let chatRoomQuery = new APIFeature(DBQuery,req.query).filter().sort().limitFields().pagination()
    const chatRoomData = await chatRoomQuery.DBQuery;
    if(!chatRoomData){
        return next(new AppError("Error in Findiing Chat Messages",404))
    }

    res.status(200).json({
        status:'success',
        data:chatRoomData
    })

})

module.exports = {
    getAllUsers,
    getChatRoom,
    getUser,
    updateUser
}