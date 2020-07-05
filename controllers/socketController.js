
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const chatRoomModel = require('../models/ChatRoomModel');
const UserModel = require('../models/UserModel');
const helper = require('../utils/helper');


const socketController = (io) => {
    return (socket) => {

        console.log("user connected")
        socket.on('join', catchAsync(async (data) => {
            console.log("user joined", data)

            const roomName = data.roomName;
            const chatRoom = await chatRoomModel.find({ roomName });
            if (helper.isEmpty(chatRoom)) {
                const chatRoomData = { roomName }
                const newChatRoom = await chatRoomModel.create(chatRoomData);
                if (!newChatRoom) {
                    return false;
                }
            }
        }))

        socket.on('message', catchAsync(async data => {
            console.log("on messages", data)
            const roomName = data.roomName;
            io.in(roomName).emit('on-message', { user: data.userName, message: data.message, messageTime: data.messageTime })
            const messageData = { message: data.message, userName: data.userName, messageTime: Date.now() };
            const updateChat = await chatRoomModel.findOneAndUpdate({ roomName }, { $push: { 'messages': messageData } })

            if (!updateChat) {
                return false;
            }
        }))

        socket.on('typing', data => {
            console.log("on typing", data)

            //Broadcasting to all the users except the one typing 
            socket.broadcast.in(data.roomName).emit('typing', { data, isTyping: true })
        })

    }
}

module.exports = socketController