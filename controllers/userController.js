const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync') 


const signUp = catchAsync(async (req,res,next)=>{
    let _reqBody = req.body;

    const newUser = await User.create(_reqBody)

    if(newUser){
        res.status(200).json({newUser})
    }
})

const login = catchAsync(async(req,res,next)=>{

})

const getAllUsers = catchAsync(async(req,res,next)=>{
    
})




module.exports = {
    signUp,
    login,
    getAllUsers
}