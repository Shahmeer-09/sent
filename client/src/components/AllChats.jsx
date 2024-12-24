import React, { Suspense, useEffect } from "react";
import MainIcon from "./Icons/MainIcon";
// import { Link } from "react-router-dom";
import Chatmenu from "./ALLChatmenu";
import ChatCard from "./ChatCard";
import { Spinner, AvatarGroup, Avatar, Tooltip } from "@nextui-org/react";
import { useRecoilState, useRecoilValue } from "recoil";
import Allchats from "../Atoms/AllChats";
import CustomFetch from "../utils/CustomFetch";
import { toast } from "react-toastify";
import fetchSwitch from "../Atoms/FetchState";
import Profilemodal from  './Profilemodal'
import Selected from "../Atoms/SelectedChat";
const AllChats = () => {
  const [chats, setChats] = useRecoilState(Allchats);
  const fetchState = useRecoilValue(fetchSwitch);
  const seleted = useRecoilValue(Selected)
  const getAllchats = async () => {
    try {
      const response = await CustomFetch.get("/chat/getChats");
      setChats(response.data?.data);
      console.log(chats)
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  useEffect(() => {
    getAllchats();
  }, [fetchState]);
  return (
    
    <section className= { `h-screen  sm:block ${seleted? "hidden":"block"} bg-zinc-900  border-gray-200  `}>
      <div className=" sm:mx-3 mx-1 flex  h-[100px]   bg-zinc-900  justify-between  items-center p-3 ">
        <div className="flex items-center">
          <MainIcon />

          <h4 className="text-white  px-4  font-semibold font-sans tracking-in-expand ">
            SENT
          </h4>
        </div>
        <div className="flex items-center" >

         <Profilemodal/>
          <Chatmenu />
        </div>
      </div>
      <div className=" p-4  w-full border-green-500  h-full ">
        {chats.length > 0 &&
          chats.map((chat) => <ChatCard key={chat._id} chat={chat} />)}
        {chats.length == 0 && (
          <div className=" flex  items-center justify-center  h-[50%]   ">
            <Tooltip
              placement="top"
              content="Select a user to start chat by searching from menu  "
              className=" m-3 "
            >
              <AvatarGroup
                isBordered
                // ma={5}
                max={6}
                className=" m-3  cursor-pointer"
              >
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              </AvatarGroup>
            </Tooltip>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllChats;
