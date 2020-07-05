const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app');
const http = require('http');

dotenv.config({path:'./config.env'})


const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const chatRoomModel = require('./models/ChatRoomModel');
const UserModel = require('./models/UserModel');
const helper = require('./utils/helper');
var allClients = [];
const socketController = require('./controllers/socketController')
  
const DB  = process.env.DB.replace('<PASSWORD>',process.env.DBPASSWORD)

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con=>{
    console.log("DB connection succesful...")
})

let port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

const io = require('socket.io').listen(server,{
  path: '/chat/socket.io'
});

const postModel = require('./models/PostModel');

io.on('connection',function(socket){
            socket.on('join', catchAsync(async (data) => {
                if(data.isInitialJoin){
                    allClients.push({socketData:{socket,data}})
                    socket.broadcast.emit('on-user-join', {data})
                    console.log("user joined", allClients)
                    let updatedUser = await UserModel.findByIdAndUpdate(data.userId,{"isOnline":"true"},{new:true})
                    if (!updatedUser) {
                        return false;
                    }
                }
                const roomName = data.roomName;
                socket.join(roomName);
                
                if(!data.isInitialJoin){
                    const chatRoom = await chatRoomModel.find({ roomName });
                    if (helper.isEmpty(chatRoom)) {
                        const chatRoomData = { roomName }
                        const newChatRoom = await chatRoomModel.create(chatRoomData);
                        if (!newChatRoom) {
                            return false;
                        }
                    }
                }
              
            })) 
    
            socket.on('message', catchAsync(async data => {
                const roomName = data.roomName;
                socket.broadcast.in(roomName).emit('on-message', {slug:data.slug,userName: data.userName, message: data.message, messageTime: data.messageTime,profilePic:data.profilePic });
             


                // io.in(roomName).emit('on-message', { user: data.userName, message: data.message, messageTime: data.messageTime })
               
            //   working
                // io.sockets.emit(roomName).emit('on-message', { user: data.userName, message: data.message, messageTime: data.messageTime })

                const messageData = { message: data.message, userName: data.userName, messageTime : data.messageTime};
                const updateChat = await chatRoomModel.findOneAndUpdate({ roomName }, { $push: { 'messages': messageData } })
    
                if (!updateChat) {
                    return false;
                }
            }))
    
            socket.on('typing', data => {
                // console.log("on typing", data)
    
                //Broadcasting to all the users except the one typing 
                socket.broadcast.in(data.roomName).emit('typing', { data, isTyping: true })

                
            })
            socket.on('notifyUser',async (notificationData) => {
            let postData = await postModel.findById(notificationData.postId);
                if(postData){
                    let _notifyingData = {
                        type:notificationData.type,
                        userData:notificationData.userData,
                        postId:notificationData.postId,
                        postContent:postData.content
                    }
                    socket.broadcast.in(postData.createdBy._id).emit('onNotifyUser', { _notifyingData})
                }
            })

            socket.on('disconnect', catchAsync( async function() {
                    let sockIndex = allClients.findIndex(elem=>elem.socketData.socket == socket)
                    if(sockIndex > -1){
                        let _sockData = allClients[sockIndex];
                        allClients.splice(sockIndex,1);
                        socket.broadcast.emit('on-user-left', {data:_sockData.socketData.data})
                        let updatedUser = await UserModel.findByIdAndUpdate(_sockData.socketData.data.userId,{"isOnline":"false"},{new:true})
                        if (!updatedUser) {
                            return false;
                        }
                    }
            }))
        })

server.listen(port);


process.on('unhandledRejection',(err)=>{
    console.log(err.name,err.message)
    console.log("UNHANDLED PROMISE REJECTION , SHUTTIND DOWN....")

    // To abort process gracefully, first close the server
    server.close(()=>{
        process.exit(1)
    })

})

module.exports = io


