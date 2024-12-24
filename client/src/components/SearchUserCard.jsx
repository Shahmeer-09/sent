import React from "react";
import { Avatar } from "@nextui-org/react";
const SearchUserCard = ({user, CreateChat }) => {
  return (
    <div
      onClick={() =>CreateChat(user._id)}
      className=" flex rounded-2xl cursor-pointer  hover:scale-105 transition-all  h-10  items-center  p-1 mb-b sm:mx-0  bg-zinc-200  text-zinc-800  "
    >
      <Avatar
        className=" w-8  h-8 "
        src={
          user?.profilepic || "https://i.pravatar.cc/150?u=a042581f4e29026024d"
        }
      />
      <div className=" flex flex-col ">
        <span className=" font-semibold mx-2 text-sm ">
          {user?.name || user?.email}{" "}
        </span>
      </div>
    </div>
  );
};

export default SearchUserCard;
