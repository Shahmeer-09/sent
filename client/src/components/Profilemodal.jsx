import { useRecoilValue } from "recoil";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import UserAtom from "../Atoms/UserAtom";
import { LuUserSquare2 } from "react-icons/lu";
  const Profilemodal=()=> {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const current = useRecoilValue(UserAtom);

  return (
    <>
      <LuUserSquare2
        onClick={onOpen}
        className=" text-[30px] text-white  cursor-pointer "
      />
      <Modal
        size="sm"
        classNames={{
          closeButton: ["hover:bg-transparent hover:text-zinc-200"],
          base: ["bg-zinc-800"],
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col  gap-1">
               
              </ModalHeader>
              <ModalBody className=" p-5  flex items-center justify-center ">
                <div className=" flex  flex-col items-center justify-center ">
                  <Avatar
                    className=" h-[200px] w-[200px]  "
                    src={current?.profilepic}
                  />
                  <div className=" text-center text-zinc-100 mt-4 ">
                    <h3  >{current?.name}</h3>
                    <h4>{current?.email}</h4>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default Profilemodal