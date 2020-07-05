const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {promisify} = require("util");

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userModel = require('../models/UserModel'); 

const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const Email = require('../controllers/emailController');


const signInToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
}

const signUp = catchAsync(async(req,res,next)=>{

    const userData = {name,email,password,confirmPassword} = req.body;

    const user = await userModel.create(userData);

    if(!user){
        const err = new AppError("Not able to create user",501);
    }
    const url = `http://localhost:4200/profile/${user.slug}`;
    await new Email(user,url).sendWelcome();

    const token = signInToken(user._id);

    res.status(200).json({
        status:'success',
        data:{user,token}
    })

})

const logIn = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        let error = new AppError('Please provide Email and Password',404)
        return next(error);
    }

    const user = await userModel.findOne({email}).select('+password');
    if(!user || ! (await user.correctPassword(password,user.password))){
        let err = new AppError('Please provide valid Email OR Password',404);
        return next(err);
    }

    let token = signInToken(user._id);

    user.password = undefined;
    res.status(200).json({
        status:'success',
        data:{user,token}
    })
})  


const protect = catchAsync(async (req,res,next)=>{

    //get token from headers
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        return next(new AppError("Yor are logged out,please log in to get access.",404));
    }
    let decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    let user = await userModel.findById(decoded.id)

    if(!user){
        return next(new AppError("The User belongs to token does no longer exist",404));
    }

    if(user.changedPassword(decoded.iat)){
        return next(new AppError("Password has been changed,please relogin to get access.",401))
    }
    req.user = user;

    next()
})

const updateMypassword = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;

    let user = await userModel.findOne({email}).select('+password')

    let isVerified = user.correctPassword(password,user.password)

    if(!user || !isVerified){
        return next(new AppError(`Incorrect email or password`,"401"));
    }

    user.password = req.body.updatedPassord;
    user.passwordConfirm = req.body.updatedPassordConfirm;

    await user.save()

    res.status(200).json({
        status:"success"
    })
})


const isLoggedIn = catchAsync(async (req,res,next)=>{
    
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    let decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    let currentUser = await userModel.findById(decoded.id)   //decoded.id is user ID

    // if(currentUser && currentUser.isUserhasChangePassword(decoded.iat)){
    //     currentUser = ""
    // }
    
    res.status(200).json({
        status:"success",
        user:currentUser
    })
})

// const confirmUserAndPassowrd = (user,next)




module.exports = {
    signUp,
    logIn,
    protect,
    updateMypassword,
    isLoggedIn
}