const mongoose = require('mongoose');


const chatRoomSchema = new mongoose.Schema({
    roomName:{
        type:String,
        required:[true,'A ChatRoom must have Room name']
    },
    messages:{
        type:Array
    },
    messageTime:{
        type:Date,
        default:Date.now()
    }
})

const chatRoomModel = new mongoose.model('chatroom',chatRoomSchema)


module.exports = chatRoomModel;