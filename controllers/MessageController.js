const { badReqError } = require("../utils/CusrtomErrors");
const Msg = require("../model/Message.model");
const Chat = require("../model/Chat.model");
const Apiresponse = require("../utils/Apiresponse");
const { StatusCodes } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const Pusher = require("pusher")


const sendMessage = async (req, res) => {
  const sender = req.user._id;
  const { chatid } = req.query;
  const { message } = req.body;
  if (!mongoose.isValidObjectId(chatid)) {
   throw new badReqError("Please enter a valid chat id");
 }
  if (!(chatid || message)) {
    throw new badReqError("All fields are required");
  }
  const newmessage = await Msg.create({
    content: message,
    sender: sender,
    chatid: chatid,
  });
  const messagefull = await Msg.find({ _id: newmessage._id })
    .populate("sender", "-password")
    .populate("chatid");
  console.log(messagefull[0]);
  if(messagefull.length!=0){
    const pusher = new Pusher({
      appId: "1827862",
      key: "0a9bdc2c0dca9fa15311",
      secret: "d3e271b829680ba83046",
      cluster: "ap2",
      useTLS: true
    });
    
   pusher.trigger(`chat-${chatid}`, "recieved", {
    message: messagefull[0],
  });
  }
  await Chat.findOneAndUpdate(
    { _id: chatid },
    { $set: { latestMessage: messagefull[0]._id } },
  );

  res.status(201).json(new Apiresponse(StatusCodes.OK, messagefull, ""));
};
const getallmessages = async (req, res) => {
  const { chatid } = req.query;
  if (!mongoose.isValidObjectId(chatid)) {
   throw new badReqError("Please enter a valid chat id");
 }
  const messages = await Msg.find({ chatid })
    .populate("sender", "-password")
    .populate("chatid");
  if (!messages) {
    throw new badReqError("No messages found");
  }
  res.status(201).json(new Apiresponse(StatusCodes.OK, messages, ""));
};
const deletconversation = async (req, res) => {
  const { chatid } = req.query;
  if (!mongoose.isValidObjectId(chatid)) {
    throw new badReqError("Please enter a valid chat id");
  }
  await Msg.deleteMany({ chatid });
  res
    .status(200)
    .json(
      new Apiresponse(StatusCodes.OK, null, "Conversation deleted successfully")
    );
};
module.exports = {
  sendMessage,
  getallmessages,
  deletconversation,
};
