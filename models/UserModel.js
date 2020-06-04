const mongoose = require('mongoose');
const validator = require('validator')
const slugify = require('slugify')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Usermust have an name']
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        validate:[validator.isEmail,'Please provide valid email']
    },
    profilePic:{
        type:String,
        default:'default.jpg'
    },
    coverPic:{
        type:String
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        select:false,
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:8,
        select:false,
        validate:{
            validator:function(val){
                return this.password == val
            },
            message:"Confirm password should be same as password"
        }

    },
    active:{
        type:Boolean,
        default:true
    },
    slug:{
        type:String
    },
    passwordChangedAt:{
        type:Date
    }
})

//document middleware
userSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next();
})


userSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next()
    
    this.password = await bcrypt.hash(this.password,12)

    this.confirmPassword = undefined;

    next();
})


userSchema.pre('save',function(next){

    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
 })



 userSchema.methods.correctPassword = async function(inputPassword,userPassword){
    return await bcrypt.compare(inputPassword,userPassword);
 }

 userSchema.methods.changedPassword = function(tokenIssueTimestamp){
    if(this.passwordChangedAt){
        let passChangeTimeStamp = parseInt((this.passwordChangedAt.getTime() / 1000),10);
        if(tokenIssueTimestamp < passChangeTimeStamp){
            return true;
        }
    }
    return false;
 }

let User = new mongoose.model("User",userSchema)   //first argument is name of model, you can access it by mongoose.model("User") from entire application


module.exports  = User;