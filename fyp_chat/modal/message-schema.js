const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  messageText: {
    type: String,
    required: [true, "MessageText is required"],
  },
  senderUserName: {
    type: String,
    required: [true, "senderUserName is required"],
  },
  receiverUserName: {
    type: String,
    required: [true, "receiverUserName is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
