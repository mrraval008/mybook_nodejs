
const errorForDev = (err,res)=>{
    console.log("err.statusCode",err.statusCode)
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        stack:err.stack,
        message:err.message
    })
}



module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"
    errorForDev(err,res);
}