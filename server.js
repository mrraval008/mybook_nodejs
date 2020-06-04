const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')


dotenv.config({path:'./config.env'})

const DB  = process.env.DB.replace('<PASSWORD>',process.env.DBPASSWORD)

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con=>{
    console.log("DB connection succesful...")
})

let port = process.env.port || 3000;

const server = app.listen(3000,()=>{
    console.log(`Listeneign at ${port}`)
})


process.on('unhandledRejection',(err)=>{
    console.log(err.name,err.message)
    console.log("UNHANDLED PROMISE REJECTION , SHUTTIND DOWN....")

    // To abort process gracefully, first close the server
    server.close(()=>{
        process.exit(1)
    })

})


