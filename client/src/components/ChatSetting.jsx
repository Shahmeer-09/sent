import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { IoMdSettings } from "react-icons/io";
const Chatmenu = ({deletechat}) => {
  return (
    <Dropdown
      classNames={{
        content: "bg-zinc-700 text-white p-3",
      }}
    >
      <DropdownTrigger>
        <span className=" cursor-pointer ">
          <IoMdSettings className="text-xl" />
        </span>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        itemClasses={{
          base: [
            "data-[hover=true]:bg-red-500",
            "data-[hover=true]:text-zinc-200",
          ],
        }}
      >
        <DropdownItem
        onPress={deletechat}
          key="delete"
          className="text-zinc-200  text-xs  bg-red-600  "
        >
          Delete conversation
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Chatmenu;
