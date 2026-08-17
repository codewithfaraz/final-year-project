const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
app.use(cors());
const server = http.createServer(app);
const conversationControllers = require("./Controllers/ConversationController");
const messageControllers = require("./Controllers/MessageControllers");
//
app.use(express.json());
require("dotenv").config({ path: "./config.env" });
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//database connection
const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then((con) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//socket.io code
const users = {};
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("register-user", (username) => {
    console.log("Registering user: ", users);
    users[username] = socket.id;
    console.log(`${username} is connected with id ${users[username]}`);
  });
  socket.on(
    "send-message",
    ({ senderUsername, receiverUsername, message }, callback) => {
      console.log("sending message....", message);
      if (users[receiverUsername]) {
        console.log("Message send to user @", users[receiverUsername]);
        io.to(users[receiverUsername]).emit("receive-message", {
          senderUsername,
        });
      }
      //here i want to send message to the database
      if (callback) callback();
    }
  );
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    const username = Object.keys(users).find((key) => users[key] === socket.id);
    // If a username was found, remove it from the users object
    if (username) {
      console.log(`Removing user: ${username}`);
      delete users[username];
    }
  });
});

//message routes
app.get("/chat/get-messages", messageControllers.getMessages);
app.post("/chat/add-message", messageControllers.addMessage);
//conversation routes
app.get("/chat/get-conversations", conversationControllers.getConversations);
app.post("/chat/add-conversation", conversationControllers.addConversation);
//listen to server
server.listen(3000, () => {
  console.log("Server is running...");
});
