import express from 'express';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';

const router = express.Router();

// Endpoint to send a message
router.post("/send/:id", async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const receiverId = req.params.id;

    // Find conversation involving both sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message,
    });

    // Save the new message and update the conversation
    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).send({ success: true, data: newMessage });
  } catch (err) {
    console.log("Error in sending message", err.message);
    res.status(500).json({ error: "Internal server error" });
  } 
}); 

// Endpoint to get messages
router.get("/:id", async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.query.senderId;

    // Find conversation involving both sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Extract messages from the conversation
    const messages = conversation.messages;
    console.log(messages);
    res.status(200).send({ success: true, data: messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}); 

export default router;
