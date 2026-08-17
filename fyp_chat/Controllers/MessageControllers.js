const Message = require("../modal/message-schema");
const Conversation = require("../modal/conversationSchema");
exports.addMessage = async (req, res, next) => {
  try {
    const { senderUserName, receiverUserName, messageText } = req.body;

    // Create the message
    const newMessage = await Message.create({
      senderUserName,
      receiverUserName,
      messageText,
    });

    // Generate a sorted array of participants (to ensure order doesn't matter)
    const participants = [senderUserName, receiverUserName].sort();

    // Check if a conversation already exists between these two users
    let conversation = await Conversation.findOne({ participants });

    if (conversation) {
      // Update the existing conversation
      conversation.lastMessage = newMessage._id;
      conversation.updatedAt = Date.now();
      await conversation.save();
    } else {
      // Create a new conversation
      conversation = await Conversation.create({
        participants,
        lastMessage: newMessage._id,
      });
    }
    return res.status(200).json({
      status: "success",
      data: { newMessage, conversation },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { receiverUsername, senderUsername } = req.query;

    console.log(receiverUsername, senderUsername);
    const messages = await Message.find({
      $or: [
        { senderUserName: senderUsername, receiverUserName: receiverUsername },
        { senderUserName: receiverUsername, receiverUserName: senderUsername },
      ],
    });
    console.log(messages);
    res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      conversations: err.message,
    });
  }
};
