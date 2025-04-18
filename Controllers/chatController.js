const Chat = require('../Models/chat');
const asyncWrapper = require('../Middleware/async');
const  BadRequest = require('../Error/BadRequest');
const  NotFound = require('../Error/NotFound');
const {sendNotification}  = require('./notificationController');

module.exports = {
  // Create a new chat between two users
  createChat: asyncWrapper(async (req, res, next) => {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
      return next(new BadRequest('Exactly two participants are required to create a chat.'));
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: participants, $size: 2 }
    });

    if (chat) {
      return res.status(200).json({ message: 'Chat already exists', chat });
    }

    chat = new Chat({ participants });
    const savedChat = await chat.save();
    await Promise.all(participants.map(async (user) => {
        await sendNotification({
          user, // Notification for each participant
          message: 'You have a new message chat.',
          type: 'chat'
        });
      }));
    res.status(201).json({ message: 'Chat created', chat: savedChat });
  }),

  // Send a message in a chat
  sendMessage: asyncWrapper(async (req, res, next) => {
    const { chatId } = req.params;
    const { sender, message } = req.body;

    if (!message || !sender) {
      return next(new BadRequest('Sender and message text are required.'));
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new NotFound('Chat not found'));

    const newMessage = {
      sender,
      message,
      sentAt: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastUpdated = new Date();
    await chat.save();

    res.status(201).json({ message: 'Message sent', chat });
  }),

  // Get chat by ID
  getChatById: asyncWrapper(async (req, res, next) => {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).populate('participants').populate('messages.sender');
    if (!chat) return next(new NotFound('Chat not found'));

    res.status(200).json({ chat });
  }),

  // Mark all messages as read for a user in a chat
  markMessagesAsRead: asyncWrapper(async (req, res, next) => {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new NotFound('Chat not found'));

    chat.messages = chat.messages.map(msg => {
      if (String(msg.sender) !== String(userId)) {
        msg.isRead = true;
      }
      return msg;
    });

    await chat.save();

    res.status(200).json({ message: 'Messages marked as read', chat });
  }),

  // Get all chats for a specific user
  getUserChats: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;

    const chats = await Chat.find({ participants: userId })
      .populate('participants')
      .sort({ lastUpdated: -1 });

    res.status(200).json({ chats });
  })
};
