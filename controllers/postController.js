const fs = require('fs');
const { promisify } = require("util");


var util = require('util');

const postModel = require('../models/PostModel')
const catchAsync = require('../utils/catchAsync')

const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeature')
const helper = require('../utils/helper')


const getAllPosts = catchAsync(async (req, res, next) => {
    let DBQuery = postModel.find();
    let apiFeatureReq = new APIFeature(DBQuery, req.query).filter().sort().limitFields().pagination()
    const posts = await apiFeatureReq.DBQuery;

    if (!posts) {
        const err = new AppError('Error in Finding Post', "404")
        return next(err);
    }

    return res.status(200).json({ status: 'success', data: posts });

})

const createPost = catchAsync(async (req, res, next) => {
    let _reqBody = req.body;
    for(let key in req.body){
        if(req.body.hasOwnProperty(key) && key != 'images'){
            _reqBody[key] = req.body[key][0]
        }
    }
    _reqBody.createdBy = req.user && req.user._id ?  req.user._id : "";
    
    let post = await postModel.create(_reqBody);
    post  = await post.populate({
        path: 'createdBy',
        select: '-__v'
    }).execPopulate()

    if (!post) {
        const err = new AppError(`Unable to Create Post`, "501")
        return next(err);
    }

    res.status(200).json({ status: 'success', data: post });

})


const updatePost = catchAsync(async (req, res, next) => {
    const _id = req.params.id;
    let _reqBody = req.body;
    _reqBody.content = _reqBody.content[0];
    
    const post = await postModel.findByIdAndUpdate(_id, req.body, { new: true });

    if (!post) {
        const err = new AppError(`Doc not found for this id - ${req.params.id}`, "404")
        return next(err);
    }

    res.status(200).json({ status: 'success', data: post });
})


const deletePost = catchAsync(async (req, res, next) => {
    const _id = req.params.id;
    const doc = await postModel.findByIdAndDelete(_id);

    if (!doc) {
        const err = new AppError(`Doc not found for this id - ${req.params.id}`, '404')
        return next(err)
    }

    return res.status(200).json(
        {
            status: 'success',
            data: null
        }
    )
})

const getById = catchAsync(async (req, res, next) => {
    const _id = req.params.id;
    const post = await postModel.findById(_id);

    if (!_id) {
        const err = new AppError(`Doc not found for this id - ${req.params.id}`, '404')
        return next(err)
    }

    res.status(200).json({
        status: 'success',
        data: post
    })
})

// const uploadImage = catchAsync(async (req, res, next) => {

//     var form = new multiparty.Form();
    
//     form.parse(req, async function (err, fields, files) {
//         try{
//             req.body = {...fields};
//             if (!helper.isEmpty(files)) {
//                 req.body.images = [];
//                 let fileUploadPromises = files.images.map((elem, index) => {
//                     let filePath = elem.path;
//                     let fileName = `${Date.now()}.jpeg`
//                     req.body.images.push(fileName);
//                     return s3.putObject({
//                         Bucket: process.env.AWS_POST_BUCKET_NAME,
//                         Body: fs.readFileSync(filePath),
//                         Key: fileName
//                     }).promise()
//                 })
//                 let result = await Promise.all(fileUploadPromises)
//             }
//             if(fields.removedImages.length > 0){
//                 let fileRemovePromises = fields.removedImages.map(img=>{
//                     let imgName = img.split("/");
//                     imgName = imgName.slice((imgName.length-2),imgName.length).join("/");
//                     return s3.deleteObject({
//                         Bucket:'mybookproject',
//                         Key:imgName
//                     }).promise()
//                 })
//                 let removedImgPro = await Promise.all(fileRemovePromises);
//             }
//             if(fields.retainedImages.length > 0){
//                 fields.retainedImages = fields.retainedImages[0].split(",");
//                 if(req.body.images){
//                     req.body.images = [...req.body.images,...fields.retainedImages];
//                 }else{
//                     req.body.images = fields.retainedImages;
//                 }
//             }
//             next();
//         }
//         catch(err){
//             console.log("err",err)
//            return next(new AppError(err,500))
//         }
//     });
// })

module.exports = {
    getAllPosts,
    createPost,
    getById,
    deletePost,
    updatePost,
    // uploadImage
}









// const uploadImage = async (req,res,next)=>{

//             var form = new multiparty.Form();

//                form.parse(req, catchAsync(async function(err, fields, files) {
//                 //  res.writeHead(200, {'content-type': 'text/plain'});
//                 //  res.write('received upload:\n\n');
//             // console.log("files",files)
//             // let filename = files.images[0].path
//             // deleteObject  without putObject body
//             if(files && files.length > 0){
//                 let fileUploadPromises = files.images.map((elem,index)=>{
//                     let filename = elem.path;  

//                     return s3.putObject({
//                         Bucket: process.env.AWS_BUCKET_NAME,
//                         Body: fs.readFileSync(filename),
//                         Key: index+".jpg"
//                       }).promise()
//                    })
//                    let result = await Promise.all(fileUploadPromises)
//                    console.log(result)
//             }else{
//                 next()
//             }


//     // promise1.promise()
//     //             .then(response => {
//     //               console.log(`done! - `, response)
//     //               console.log(
//     //                 `The URL is ${s3.getSignedUrl('getObject', { Bucket: process.env.AWS_BUCKET_NAME, Key: "imageRemoteName1.jpg" })}`
//     //               )
//     //             })
//     //             .catch(err => {
//     //               console.log('failed:', err)
//     //             })

//                }));

//     }