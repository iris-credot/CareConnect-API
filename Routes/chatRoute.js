const express = require('express');
const Chatrouter = express.Router();
const auth = require('../Middleware/authentication');
const chatController = require('../Controllers/chatController');

// Create a new chat between two users
Chatrouter.post('/create', auth.AuthJWT, chatController.createChat);
Chatrouter.post('/message/:chatId', auth.AuthJWT, chatController.sendMessage);
Chatrouter.get('/:chatId', auth.AuthJWT, chatController.getChatById);
Chatrouter.put('/read/:chatId', auth.AuthJWT, chatController.markMessagesAsRead);
Chatrouter.get('/user/:userId', auth.AuthJWT, chatController.getUserChats);

module.exports = Chatrouter;