const Conversation = require("../modal/conversationSchema");
exports.getConversations = async (req, res, next) => {
  const username = req.query.username;
  try {
    const conversations = await Conversation.find({
      participants: username,
    })
      .populate("lastMessage") // Populate the referenced message
      .sort({ updatedAt: -1 });
    console.log("this works");
    console.log(conversations);
    res.status(200).json({
      status: "success",
      data: {
        conversations,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      conversations: err.message,
    });
  }
};
exports.addConversation = async (req, res, next) => {
  try {
    console.log(req.body);
    const conversation = await Conversation.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        conversation,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      conversations: err.message,
    });
  }
};
exports.start = async (req, res, next) => {
  console.log(req.body.username);
  return res.status(200).json({
    message: "server is listening to requests",
  });
};
