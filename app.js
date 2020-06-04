const express = require('express')
const app = express(); 

const cors = require('cors')

app.use(cors())

app.use(express.json({limit:'10kb'}))   //body parser



const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoute');
const commentRouter = require('./routes/commentRoutes');
const likeRouter = require('./routes/likeRoute');

const errorController = require('./controllers/errorController');


app.use('/api/v1/posts',postRouter);
app.use('/api/v1/users',userRouter)
app.use('/api/v1/comments',commentRouter)
app.use('/api/v1/likes',likeRouter)

app.use(express.static(`${__dirname}/public`))

app.all('*',(req,res,next)=>{
    res.send(`this route is not handled yet`)
})


app.use(errorController)


module.exports  = app



//https://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619