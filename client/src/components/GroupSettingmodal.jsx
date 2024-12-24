import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import { GrFormTrash } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Avatar,
} from "@nextui-org/react";
import Selected from "../Atoms/SelectedChat";
import { useRecoilValue, useRecoilState } from "recoil";
import CustomFetch from "../utils/CustomFetch";
import fetchSwitch from "../Atoms/FetchState";
import UserAtom from "../Atoms/UserAtom";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { Spinner } from "@nextui-org/react";
const GroupSettingmodal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useRecoilState(Selected);
  const [loading, setloading] = useState("");
  const [searchgrp, setSearchgrp] = useState("");
  const current = useRecoilValue(UserAtom);
  const [members, setmembers] = useState(selected?.members);
  const [admin, setadmin] = useState(false);
  const [newname, setnewname] = useState("");
  const [fetchState, setfetchswitch] = useRecoilState(fetchSwitch);
  const [searchedUSer, setsearcheUsers] = useState([]);
  const [badge, setbadge] = useState([]);
  const [error, seterror] = useState("");
  useEffect(() => {
    if (selected?.groupAdmin?._id === current?._id) {
      setadmin(true);
    }
  }, [selected]);
  const handleSubmit = async (e) => {
    setloading(true);
    try {
      const user = await CustomFetch.post("/auth/search", {
        search: searchgrp,
      });
      setsearcheUsers(user.data?.data);
      setloading(false);
      seterror("");
    } catch (error) {
      seterror(error?.response?.data?.message || error.message);
      setloading(false);
      setsearcheUsers([]);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSubmit();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [searchgrp]);
  const handleRemoveMember = async (memid) => {
    if(memid ===current._id){
      toast.error("You can't remove yourself")
      return
    }
    console.log(memid, selected.members);
    try {
      const res = await CustomFetch.post(
        `/chat/removeMember?chatid=${selected._id}`,
        { memberid: memid }
      );
      setmembers(members.filter((mem) => mem._id !== memid));
      toast.success(res?.data?.message);
      setfetchswitch(!fetchState);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const handleLeavegroup = async () => {
    try {
      const res = await CustomFetch.post(
        `/chat/leaveGroup?chatid=${selected._id}`
      );
      toast.success(res?.data?.message);
      setSelected("");
      setfetchswitch(!fetchState);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const handleDeletegoup = async (req, res) => {
     try {
      const chat = await CustomFetch.post(`/chat/delGroup?chatid=${selected._id}`)
      toast.success(chat?.data?.message)
      setfetchswitch(!fetchState)
      setSelected("")
     } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
     }
  };
  const handleremove = (user) => {
    setbadge(badge.filter((b) => b._id != user._id));
  };
  const handleUpdatename = async () => {
    try {
      const res = await CustomFetch.post(
        `/chat/updatname?chatid=${selected._id}`,
        { chatname: newname }
      );
      toast.success(res?.data?.message);
      setnewname("");
      setSelected(res.data?.data);
      setfetchswitch(!fetchState);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setnewname("");
    }
  };
  const handleAddmembers = async () => {
       try {
         const res = await CustomFetch.post(`/chat/addnewmembers?chatid=${selected._id}`,{newmember:badge} )
         toast.success(res.data?.success)
         setfetchswitch(!fetchState)
         setmembers([...members,...badge])
         setbadge([])
         setSearchgrp("")
       } catch (error) {
          toast.error(error?.response?.data?.message || error.message)
       }
  };

  return (

    <>
      <span className="cursor-pointer p-2" onClick={onOpen}>
        <IoMdSettings className="text-xl" />
      </span>
      <Modal
        className=" bg-zinc-800 "
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        classNames={{
          closeButton: ["hover:bg-transparent hover:text-zinc-200"],
        }}
        placement="right"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-zinc-100">
                Group settings
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter New group name"
                    radius="md"
                    color="default"
                    size="sm"
                    value={newname}
                    onChange={(e) => setnewname(e.target.value)}
                    classNames={{
                      input: [
                        " text-zinc-300",
                        " text-xs",
                        " placeholder:text-zinc-400  ",
                      ],
                    }}
                  />
                  <Button
                    size="sm"
                    className=" text-zinc-100 bg-yellow-600 px-4 "
                    onClick={handleUpdatename}
                  >
                    Update name
                  </Button>
                </div>
                {admin && (
                  <div>
                    <div className=" w-full flex  gap-2 ">
                      <input
                        type="text"
                        value={searchgrp}
                        onChange={(e) => setSearchgrp(e.target.value)}
                        placeholder="Search User to add in group "
                        className=" w-full p-2 h-8 outline-none text-xs rounded-xl bg-zinc-100 text-zinc-800 "
                      />
                      <Button
                        onClick={handleAddmembers}
                        className=" bg-yellow-600    text-xs  rounded-lg text-white px-3 h-8  "
                      >
                        Add to grp
                      </Button>
                    </div>
                    <div className=" max-h-[100px] overflow-hidden scrollbar-hide my-2  flex gap-2 flex-wrap  ">
                      {badge &&
                        badge.length >= 0 &&
                        badge.map((bg) => (
                          <span
                            key={bg._id}
                            className=" text-xs p-1 bg-yellow-600 flex rounded-md items-center text-white gap-2 "
                          >
                            {bg.name}
                            <RxCross2
                              onClick={() => handleremove(bg)}
                              className=" font-bold cursor-pointer "
                            />
                          </span>
                        ))}
                    </div>
                    <div className=" flex gap-2 flex-wrap  p-2  ">
                      {error != "" && (
                        <p className=" text-blue-200 text-sm text-center ">
                          {error.includes("search is required")
                            ? "*Search user"
                            : error}
                        </p>
                      )}
                      {loading && <Spinner color="default" />}
                      {!loading &&
                        error == "" &&
                        searchedUSer &&
                        searchedUSer.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => setbadge([user, ...badge])}
                            className=" items-center flex gap-2  cursor-pointer  p-1 bg-zinc-100  rounded-3xl w-[100px]  text-zinc-800"
                          >
                            <Avatar
                              className=" h-5 w-6 "
                              src={user?.profilepic}
                            />
                            <span className="text-xs">{user?.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                <h5 className="   text-zinc-100 font-bold  text-sm ">
                  Members
                </h5>
                <div className="flex p-1 overflow-y-scroll max-h-[80px]  scrollbar-hide  flex-wrap items-center justify-start  gap-4">
                  {members &&
                    members.map((mem) => (
                      <div className="flex items-center  w-[300px]  justify-between bg-zinc-100  rounded-3xl  p-1 ">
                        <div className="flex items-center gap-2 ">
                          <Avatar className=" h-6 w-6 " src={mem?.profilepic} />
                          <p className=" text-xs font-semibold ">{mem?.name}</p>
                        </div>
                        {admin ? (
                          <GrFormTrash
                            onClick={() => handleRemoveMember(mem._id)}
                            className=" cursor-pointer  mx-3  "
                          />
                        ) : (
                          <span className="mx-4"> </span>
                        )}
                      </div>
                    ))}
                </div>
              </ModalBody>
              <ModalFooter>
                {!admin ? (
                  <Button
                    onClick={handleLeavegroup}
                    className=" bg-red-700 text-zinc-100 "
                    onPress={onClose}
                    size="sm"
                  >
                    Leave grp
                  </Button>
                ) : (
                  <Button
                    onClick={handleDeletegoup}
                    color="danger"
                    onPress={onClose}
                    size="sm"
                  >
                    Delete grp
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupSettingmodal;
