import React from "react";
import { Avatar, select } from "@nextui-org/react";
import { getSender } from "../utils/ChatUtils";
import UserAtom from "../Atoms/UserAtom";
import Selected from "../Atoms/SelectedChat";
import { useRecoilValue, useSetRecoilState } from "recoil";
const ChatCard = ({ chat }) => {
  const current = useRecoilValue(UserAtom);
  const setSelected = useSetRecoilState(Selected);
  const sender = getSender(chat.members, current);

  return (
    <>
      {chat.isGroupChat ? (
        <div
          onClick={() => setSelected(chat)}
          className=" flex hover:scale-105 transition-all   rounded-2xl  cursor-pointer   mx-8  items-center  p-1 mb-3 sm:mx-0 md:mx-2 bg-zinc-200  text-zinc-800  gap-2 "
        >
          <Avatar
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            src={
              chat.Chaticon ||
              "https://user-images.githubusercontent.com/1468166/37978116-46efb0e0-31b3-11e8-8d51-8d7af47d6f1c.png"
            }
          />
          <div className=" flex flex-col ">
            <span className=" font-semibold  sm:text-xs md:text-sm ">
              {chat.ChatName}
            </span>
            {/* <span className="sm:text-xs md:text-sm "> */}
              <div className="flex gap-1 items-center ">
                <p className=" sm:text-sm text-xs font-semibold  ">
                  {chat.latestMessage?.sender?.name} :
                </p>
                {chat.latestMessage == null ? (
                  <p className="sm:text-sm  text-xs">
                    select a chat to start conversation
                  </p>
                ) : (
                  <p className="sm:text-sm  text-xs">
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
         
          </div>
        </div>
      ) : (
        <div
          onClick={() => setSelected(chat)}
          className=" flex hover:scale-105 transition-all  rounded-2xl cursor-pointer    mx-8  items-center  p-1 mb-3 sm:mx-0 md:mx-2 bg-zinc-200  text-zinc-800  gap-2 "
        >
          <Avatar
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            src={
              sender?.profilepic ||
              "https://i.pravatar.cc/150?u=a042581f4e29026024d"
            }
          />
          <div className=" flex flex-col ">
            <span className=" font-bold  sm:text-xs md:text-sm ">
              {sender?.name}
            </span>
            <div className="flex gap-1 items-center ">
              <p className=" sm:text-sm text-xs font-semibold  ">
                {chat.latestMessage?.sender?.name}
              </p>
              {chat.latestMessage == null ? (
                <p className="sm:text-sm  text-xs">
                  select a chat to start conversation
                </p>
              ) : (
                <p className="sm:text-sm  text-xs">
                  {chat.latestMessage.content}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatCard;
