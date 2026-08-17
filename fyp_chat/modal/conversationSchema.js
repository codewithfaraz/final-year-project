const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [String], // Array of usernames (e.g., ["innovator1", "expert1"])
    required: true,
    validate: [
      (arr) => arr.length === 2,
      "Participants must include exactly two users",
    ],
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message", // Reference to the last message in this conversation
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
