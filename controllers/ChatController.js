const { StatusCodes } = require("http-status-codes");
const Chat = require("../model/Chat.model");
const Apiresponse = require("../utils/Apiresponse");
const { NotfoundError, badReqError } = require("../utils/CusrtomErrors");

const CreatChat = async (req, res) => {
  const { userId } = req.body;
  const ChatFind = await Chat.find({
    members: { $all: [userId, req.user._id] },
  })
    .populate("members", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name email profilepic",
      },
    })
    .sort({ updatedAt: -1 });
  if (ChatFind.length > 0) {
    res
      .status(200)
      .json(new Apiresponse(StatusCodes.OK, ChatFind, "Chat found"));
  } else {
    const newChat = {
      members: [userId, req.user._id],
    };
    const chatCreated = await Chat.create(newChat);
    const comchat = await Chat.find({ _id: chatCreated._id }).populate(
      "members",
      "-password"
    );

    res
      .status(200)
      .json(new Apiresponse(StatusCodes.OK, comchat, "Chat created"));
  }
};

const getAllChats = async (req, res) => {
  const userid = req.user._id;
  const allchats = await Chat.find({ members: { $in: [userid] } })
    .populate("groupAdmin", "-password")
    .populate("members", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name email profilepic",
      },
    })
    .sort({ updatedAt: -1 });

  if (!allchats) {
    throw NotfoundError("Chats not found");
  }
  res
    .status(200)
    .json(new Apiresponse(StatusCodes.OK, allchats, "All chats found"));
};
const CreateGroup = async (req, res) => {
  const { users, chatname } = req.body;
  if (chatname == "" || users.length == 0) {
    throw new badReqError("Please fill all the fields");
  }
  if (users.length < 2) {
    throw new badReqError(
      "More than 2 users are required to form a group chat"
    );
  }

  users.push(req.user._id);
  console.log(chatname);
  const newGroup = await Chat.create({
    ChatName: chatname,
    groupAdmin: req.user._id,
    isGroupChat: true,
    members: users,
  });

  if (newGroup) {
    const fullGroup = await Chat.findOne({ _id: newGroup._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email profilepic",
        },
      })
    res
      .status(200)
      .json(
        new Apiresponse(StatusCodes.OK, fullGroup, "Group created successfully")
      );
  } else {
    res.status(400);
    throw new Error("Failed to create group");
  }
};

const UpdateGroupname = async (req, res) => {
  const { chatid } = req.query;
  const { chatname } = req.body;
  if (!chatname) {
    throw new badReqError("Please enter a valid name to update");
  }
  const chat = await Chat.findOneAndUpdate(
    { _id: chatid },
    { $set: { ChatName: chatname } },
    { new: true }
  )
    .populate("groupAdmin", "-password")
    .populate("members", "-passowrd")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name email profilepic",
      },
    })
  if (!chat) {
    throw new NotfoundError("Chat not found");
  }
  res
    .status(200)
    .json(
      new Apiresponse(StatusCodes.OK, chat, "Group name updated successfully")
    );
};
const RemoveMember = async (req, res) => {
  const { chatid } = req.query;
  const { memberid } = req.body;

  const chat = await Chat.findOne({ _id: chatid });
  if (!chat) {
    throw new NotfoundError("Chat not found");
  }
  if (chat.members.length > 2) {
    chat.members = chat.members.filter((mem) => mem._id.toString() != memberid);
  } else {
    throw new badReqError(
      "Can`t remove the only member from the group, you may delete the group"
    );
  }
  await chat.save();
  const updatedChat = await Chat.findOne({ _id: chatid })
    .populate("members", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name email profilepic",
      },
    })
  res
    .status(200)
    .json(
      new Apiresponse(
        StatusCodes.OK,
        updatedChat,
        "Member removed from the group successfully"
      )
    );
};
const leavegroup = async (req, res) => {
  const { chatid } = req.query;
  const userid = req.user._id;
  const chat = await Chat.findOneAndUpdate({ _id: chatid } ,{$pull:{members:userid}} );
  if (!chat) {
    throw new NotfoundError("Chat not found");
  }
  res
    .status(200)
    .json(
      new Apiresponse(StatusCodes.OK, null, "You left the group successfully")
    );
};
const addnewmembers = async(req, res)=>{
  const { chatid } = req.query;
    const { newmember } = req.body;
    if (newmember.length == 0) {
      throw badReqError("Atleat there should be a member");
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: chatid },
      { $push: { members: { $each: newmember } } },
      { new: true }
    )
      .populate("groupAdmin", "-password")
      .populate("members", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email profilepic",
        },
      })
    if (!chat) {
      throw badReqError("Chat not found");
    }

    res
      .status(200)
      .json(new Apiresponse(StatusCodes.OK, chat, "members added successfuly"));
}
const deleteGroup = async(req, res)=>{
    const {chatid} = req.query;
    const chat = await Chat.findOneAndDelete({_id:chatid});
    if(!chat){
        throw new NotfoundError("Chat not found");
    }
    res
    .status(200)
    .json(new Apiresponse(StatusCodes.OK, null, "Group deleted successfully"));
}

module.exports = {
  CreatChat,
  getAllChats,
  CreateGroup,
  UpdateGroupname,
  RemoveMember,
  leavegroup,
  addnewmembers,
  deleteGroup
};
