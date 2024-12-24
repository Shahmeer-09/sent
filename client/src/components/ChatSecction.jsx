// const ENDPOINT = "https://sent-xi.vercel.app/";
import React, { useEffect, useRef, useState } from "react";
import Selected from "../Atoms/SelectedChat";
import UserAtom from "../Atoms/UserAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import animationdata from "../assets/chatanim.json";
import Lottie from "react-lottie";
import { Avatar } from "@nextui-org/react";
import { IoIosSend } from "react-icons/io";
import { getSender, isSameSender } from "../utils/ChatUtils";
import GroupSettingmodal from "./GroupSettingmodal";
import { FaArrowLeftLong, FaLeaf } from "react-icons/fa6";
import Chatmenu from "./ChatSetting";
import CustomFetch from "../utils/CustomFetch";
import { toast } from "react-toastify";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "./EmojiPicker";
import fetchSwitch from "../Atoms/FetchState";
import Pusher from "pusher-js";
var channel;
const ChatSecction = () => {
  const [fetchState, setfetchstate] = useRecoilState(fetchSwitch);
  const containerRef = useRef();
  const current = useRecoilValue(UserAtom);
  const [selected, setselected] = useRecoilState(Selected);
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(false);
  const [messsages, setmessages] = useState([]);
  const [emoji, setemoji] = useState(false);
  const chatSectionRef = useRef(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationdata,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTo({
        top: chatSectionRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messsages]);

  let sender = selected ? getSender(selected?.members, current) : null;

  useEffect(() => {
    fetchmessages();
    const pusher = new Pusher("0a9bdc2c0dca9fa15311", {
      cluster: "ap2",
      encrypted: true,
    });
    channel = pusher.subscribe(`chat-${selected._id}`);

    channel.bind("recieved", function (newmessage) {
      if (!newmessage || newmessage?.message == {}) return;
      const gotMessage = newmessage?.message;
      if (gotMessage?.sender?._id != current?._id && gotMessage != {}) {
        setmessages((prev) => [...prev, gotMessage]);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.unsubscribe(selected._id);
    };
  }, [selected]);

  const fetchmessages = async () => {
    try {
      const res = await CustomFetch.get(
        `/message/getMessages?chatid=${selected._id}`
      );
      setmessages(res.data?.data);
      if (res.data?.data.length === 0) {
        toast.info(
          "No chats found either cleared or didnt have any to begin with"
        );
        setmessages("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendmessage = async () => {
    setloading(false);
    try {
      const res = await CustomFetch.post(
        `/message/sendMessage?chatid=${selected._id}`,
        { message: message }
      );
      setmessages((messsages) => [...messsages, res.data?.data[0]]);
      setmessage("");
      setfetchstate(!fetchState);
    } catch (error) {
      setloading(false);
      console.log(error.response?.data?.message || error.message);
    }
  };

  const handleDeletetConv = async () => {
    try {
      if (messsages.length > 0) {
        await CustomFetch.post(`/message/delMessages?chatid=${selected._id}`);
        toast.success("Conversation deleted successfully");
      } else {
        toast.info("no chat  to delete");
      }
      setmessages("");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        chatSectionRef.current.scrollBy({
          top: -50,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowDown") {
        chatSectionRef.current.scrollBy({
          top: 50,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setemoji(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (message.trim() !== "") {
          handleSendmessage();
        }
      }
    };

    window.addEventListener("keypress", handleEnter);
    return () => {
      window.removeEventListener("keypress", handleEnter);
    };
  }, [message]);
  return (
    <>
      {!selected ? (
        <div className="w-full h-full flex  flex-col relative  items-center justify-center pointer-events-none ">
          <h5 className="  text-yellow-500 absolute letter-spacing  top-[27%] z-10 font-sans font-bold text-xs ">
            {" "}
            Select a chat to start messaging{" "}
          </h5>
          <Lottie
            loop={true}
            options={defaultOptions}
            height={300}
            width={300}
          />
        </div>
      ) : (
        <>
          <header className="h-12 flex justify-between items-center    mb-3  px-4 p-2 text-center  bg-zinc-200  rounded-lg ">
            <div className=" ">
              <div className="flex items-center gap-2 ">
                <Avatar
                  size="md"
                  src={
                    selected.isGroupChat
                      ? selected?.Chaticon
                      : sender?.profilepic
                  }
                  color="gradient"
                />
                <div>
                  <p className=" font-bold font-mono  flex flex-col ">
                    {selected.isGroupChat ? selected.ChatName : sender?.name}
                  </p>
                  {selected.isGroupChat && (
                    <span className=" inline text-xs font-semibold text-yellow-600 ">
                      {" "}
                      Admin:{" "}
                      <p className=" text-xs text-zinc-600  inline">
                        {selected?.groupAdmin?.name}
                      </p>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className=" flex items-center gap-4  ">
              <FaArrowLeftLong
                className=" cursor-pointer "
                onClick={() => {
                  setselected("");
                  setmessages("");
                }}
              />

              <>
                {selected.isGroupChat ? (
                  <GroupSettingmodal />
                ) : (
                  <Chatmenu deletechat={handleDeletetConv} />
                )}
              </>
            </div>
          </header>

          <section className=" chatbg h-[78%] w-full  z-0 flex justify-center items-center rounded-lg p-4 ">
            <div
              ref={chatSectionRef}
              className="sm:w-[90%]  w-[100%]    overflow-y-scroll  scrollbar-hide h-full sm:h-[90%] bg-transparent   flex-col  flex gap-2   "
            >
              {messsages.length > 0 &&
                messsages.map(
                  (msg) =>
                    msg != {} && (
                      <span
                        key={msg._id}
                        className={`p-2 px-3  text-sm  ${
                          msg?.sender?._id && msg?.sender?._id == current?._id
                            ? " self-end bg-zinc-800 text-zinc-100 "
                            : "bg-zinc-300 text-zinc-800  self-start"
                        }  z-10  text-xs  rounded-lg    `}
                      >
                        <p className=" inline text-yellow-500 font-semibold text-xs  ">
                          {msg?.sender?._id && msg?.sender?._id == current?._id
                            ? ""
                            : `${msg?.sender?.name}`}
                        </p>

                        <p className="inline"> {msg.content}</p>
                      </span>
                    )
                )}
            </div>
          </section>
          <div
            ref={containerRef}
            className="px-2 p-1  relative w-[90%] bg-zinc-900 h-12 flex justify-around items-center mx-auto rounded-3xl    mt-3  "
          >
            {emoji && <EmojiPicker setmessage={setmessage} message={message} />}
            <MdOutlineEmojiEmotions
              onClick={() => setemoji(!emoji)}
              className=" text-white cursor-pointer size-6 mx-6"
            />
            <input
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              type="text"
              className=" bg-transparent  h-full w-[90%] p-1 px-3 outline-none text-sm text-white    rounded-3xl block  placeholder:text-sm mx-auto "
              placeholder="Type message here... "
            />
            <IoIosSend
              onClick={handleSendmessage}
              className=" text-white size-6 mx-6 cursor-pointer "
            />
          </div>
        </>
      )}
    </>
  );
};

export default ChatSecction;
