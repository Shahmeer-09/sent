const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    messageimage: {
      type: String,
      default: "",
    },
    mimagepublic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Msg = mongoose.model("Message", MessageSchema);
module.exports = Msg;
