const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    ChatName: {
      type: String,
      trim: true,
      default: "",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isGroupChat: { type: Boolean, default: false },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    Chaticon: {
      type: String,
      default:
        "https://user-images.githubusercontent.com/1468166/37978116-46efb0e0-31b3-11e8-8d51-8d7af47d6f1c.png",
    },
    Chaticonpublic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
