const { promisify } = require("util");

const fs = require('fs');
var AWS = require('aws-sdk');
var multiparty = require('multiparty');

const catchAsync = require('../utils/catchAsync')
const helper = require('../utils/helper')
const AppError = require('../utils/appError')



AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})
const s3 = new AWS.S3();



const uploadImages = (subFolder) => {
    return catchAsync(async (req, res, next) => {
        var form = new multiparty.Form();
        form.parse(req, handler(req, res, next, subFolder));
    })
}


const handler = (req, res, next, subFolder) => {

    return async (err, fields, files) => {
        try {
            req.body = { ...fields };
            let bucketName = process.env.AWS_BUCKET_NAME;
            if (!helper.isEmpty(files)) {
                let fileKey = Object.keys(files)[0];
                req.body[fileKey] = [];
                let fileUploadPromises = files[fileKey].map((elem, index) => {
                    let filePath = elem.path;
                    let fileName = `${Date.now()}.jpeg`
                    if(subFolder === "posts"){
                        req.body[fileKey].push(`${process.env.AWS_URL}/${subFolder}/${fileName}`);
                    }else{
                        req.body[fileKey] = `${process.env.AWS_URL}/${subFolder}/${fileName}`;
                    }
                    return s3.putObject({
                        Bucket: `mybookproject/${subFolder}`,
                        Body: fs.readFileSync(filePath),
                        Key: fileName
                    }).promise()
                })
                let result = await Promise.all(fileUploadPromises).catch(err => next(new AppError(err, 500)))
            }
            if (fields.removedImages && fields.removedImages.length > 0) {
                let fileRemovePromises = fields.removedImages.map(img => {
                    let imgName = img.split("/");
                    imgName = imgName.slice((imgName.length - 2), imgName.length).join("/");
                    return s3.deleteObject({
                        Bucket: bucketName,
                        Key: imgName
                    }).promise()
                })
                let removedImgPro = await Promise.all(fileRemovePromises).catch(err => next(new AppError(err, 500)))
            }
            if (fields.retainedImages && fields.retainedImages.length > 0) {
                fields.retainedImages = fields.retainedImages[0].split(",");
                if (req.body.images) {
                    req.body.images = [...req.body.images, ...fields.retainedImages];
                } else {
                    req.body.images = fields.retainedImages;
                }
            }
            next();
        } catch (err) {
            console.log("err4333", err)
            next(new AppError(err, 500))
        }
    }

}

const handler2 = async (err, fields, files) => {
    req.body = { ...fields };
    let bucketName = process.env.AWS_BUCKET_NAME;
    req.body.images = [cad];
    if (!helper.isEmpty(files)) {
        let fileUploadPromises = files.images.map((elem, index) => {
            let filePath = elem.path;
            let fileName = `${Date.now()}.jpeg`
            req.body.images.push(`${process.env.AWS_URL}/${subFolder}/${fileName}`);
            return s3.putObject({
                Bucket: `${bucketName}/${subFolder}`,
                Body: fs.readFileSync(filePath),
                Key: fileName
            }).promise()
        })
        let result = await Promise.all(fileUploadPromises).catch(err => next(err))
    }
    if (fields.removedImages && fields.removedImages.length > 0) {
        let fileRemovePromises = fields.removedImages.map(img => {
            let imgName = img.split("/");
            imgName = imgName.slice((imgName.length - 2), imgName.length).join("/");
            return s3.deleteObject({
                Bucket: bucketName,
                Key: imgName
            }).promise()
        })
        let removedImgPro = await Promise.all(fileRemovePromises).catch(err => next(err))
    }
    if (fields.retainedImages && fields.retainedImages.length > 0) {
        fields.retainedImages = fields.retainedImages[0].split(",");
        if (req.body.images) {
            req.body.images = [...req.body.images, ...fields.retainedImages];
        } else {
            req.body.images = fields.retainedImages;
        }
    }
    next();
}
module.exports = {
    uploadImages
}