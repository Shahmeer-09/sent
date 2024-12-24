import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  user,
  Spinner,
} from "@nextui-org/react";
import { RiMenuSearchLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { FiSearch,FiLogOut } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Badge,
} from "@nextui-org/react";
import CustomFetch from "../utils/CustomFetch";
import SearchUserCard from "./SearchUserCard";
import Selected from "../Atoms/SelectedChat";
import Allchats from "../Atoms/AllChats";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import GroupSeachCard from "./GroupSeachCard";
import { useNavigate } from "react-router-dom";
import UserAtom from "../Atoms/UserAtom";
const Chatmenu = () => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [searchedUSer, setsearcheUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, seterror] = useState("");
  const [loadin, setloading] = useState(false);
  const [selectedchat, setselected] = useRecoilState(Selected);
  const setUser = useSetRecoilState(UserAtom)
  const [chats, setChats] = useRecoilState(Allchats);
  const [group, setgroup] = useState(false);
  const [badge, setbadgeVal] = useState([]);
  const [groupname, setgroupName] = useState("");
  const preverSearch = useRef("");
  const handleSubmit = async (e) => {
    setloading(true);
    try {
      const user = await CustomFetch.post("/auth/search", { search });
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
  }, [search]);

  const handleCreateChat = async (id) => {
    try {
      const founChat = await CustomFetch.post("/chat/createChat", {
        userId: id,
      });
      const chat =await founChat.data?.data;
      if (!chats.find((c) => c._id === chat[0]._id))
        setChats([chat[0], ...chats]);
      setselected(chat[0]);
      console.log(selectedchat)
      onClose();
      setSearch("");
      setbadgeVal([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const handlselected = (user) => {
    if (badge.find((b) => b._id === user._id)) {
      toast.error("User already added");
      return;
    }
    setbadgeVal([user, ...badge]);
  };
  const handleremove = (user) => {
    setbadgeVal(badge.filter((b) => b._id != user._id));
  };
  const handleCreateGroup = async () => {
    setloading(true);
    try {
      const group = await CustomFetch.post("/chat/createGroup", {
        chatname: groupname,
        users: badge.map((b) => b._id),
      });
      console.log(group.data?.data);
      toast.success(group.data?.message);
      setloading(false);
      setbadgeVal([])
      setgroupName("")
      setSearch("");
        setChats([group.data?.data, ...chats]);
      setselected(group.data?.data);
      onClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setloading(false);
    }
  };
  const handleLogout =()=>{
    setloading(true)
    try {
        const res = CustomFetch.post('/auth/logout')
        toast.success("Loged Out")
        navigate('/authpage')
        setUser('')
        localStorage.clear()
        setloading(false)
        setselected("")
    } catch (error) {
      toast.error( error?.response?.data?.message||error.message)
      setloading(false)
    }
  }
  return (
    <>
      <Dropdown className="   bg-zinc-700 text-zinc-50 ">
        <DropdownTrigger>
          <Button className=" bg-transparent px-0 ">
            <RiMenuSearchLine className=" text-zinc-100 size-8  font-bold " />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          itemClasses={{
            base: [
              "data-[hover=true]:bg-zinc-800 data-[hover=true]:text-zinc-100 ",
            ],
          }}
          className=" bg-zinc-700 "
          aria-label="Static Actions"
        >
          <DropdownItem
            onPress={() => {
              onOpen();
              setgroup(true);
            }}
            key="group"
            endContent={<FaPlus />}
          >
            Create group
          </DropdownItem>
          <DropdownItem
            onPress={() => {
              onOpen(), setgroup(false);
            }}
            key="search"
            endContent={<FiSearch />}
          >
            Search user
          </DropdownItem>
          <DropdownItem  className=" bg-zinc-500"  onClick={handleLogout}  endContent={<FiLogOut/>} >  
            {
              loadin ? "Signing out": "sign out"
            }
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {!group ? (
        <Modal
          classNames={{
            closeButton: ["hover:bg-transparent hover:text-white"],
            base: "bg-zinc-700 text-zinc-100 max-h-[400px] ",
            header: "",
          }}
          size="xs"
          placement="top"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 mx-5  ">
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search User , group..."
                    labelPlacement="outside"
                    classNames={{
                      input: [" text-zinc-700 ", "placeholder:text-zinc-400"],
                      inputWrapper: ["group-data-[focus=true]:bg-zinc-200"],
                    }}
                    endContent={
                      <FiSearch className="text-2xl text-zinc-700 pointer-events-none flex-shrink-0" />
                    }
                  />
                </ModalHeader>
                <ModalBody className="overflow-y-scroll scrollbar-hide">
                  {error != "" && (
                    <p className=" text-blue-200 text-sm text-center ">
                      {error.includes("search is required")
                        ? "*Search user"
                        : error}
                    </p>
                  )}
                  {loadin && <Spinner color="default" />}
                  {!loadin &&
                    error == "" &&
                    searchedUSer &&
                    searchedUSer.map((user) => (
                      <SearchUserCard
                        key={user._id}
                        user={user}
                        CreateChat={handleCreateChat}
                      />
                    ))}
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : (
        <Modal
          classNames={{
            closeButton: ["hover:bg-transparent hover:text-white "],
            base: "bg-zinc-700 text-zinc-100 max-h-[400px] ",
            header: "",
          }}
          size="sm"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create Group
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    required
                    value={groupname}
                    onChange={(e) => setgroupName(e.target.value)}
                    classNames={{
                      input: [" text-zinc-700 ", "placeholder:text-zinc-400"],
                    }}
                    placeholder="Enter Group Name"
                  />
                  <Input
                    type="text"
                    required
                    classNames={{
                      input: [" text-zinc-700", "placeholder:text-zinc-400"],
                    }}
                    placeholder="search user"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <div className=" flex gap-2 flex-wrap  ">
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
                  <div className="flex flex-col gap-2">
                    {error != "" && (
                      <p className=" text-blue-200 text-sm text-center ">
                        {error.includes("search is required")
                          ? "*Search to add user"
                          : error}
                      </p>
                    )}
                    {loadin && <Spinner color="default" />}
                    {!loadin &&
                      error == "" &&
                      searchedUSer &&
                      searchedUSer.map((user) => (
                        <GroupSeachCard
                          key={user._id}
                          user={user}
                          handlselected={() => handlselected(user)}
                        />
                      ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-zinc-100 hover:bg-zinc-300 "
                    onPress={handleCreateGroup}
                  >
                    {loadin ? "creating" : " Create"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Chatmenu;
