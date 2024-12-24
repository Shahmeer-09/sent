import React from 'react'
import { Avatar } from '@nextui-org/react'
const GroupSeachCard = ({user,handlselected}) => {
  return (
    <div
    onClick={handlselected}
      className=" flex rounded-2xl cursor-pointer w-[200px]  hover:scale-105 transition-all  h-8  items-center  p-1 mb-b sm:mx-0  bg-zinc-200  text-zinc-800  "
    >
      <Avatar
        className=" w-6  h-6 "
        src={
          user?.profilepic || "https://i.pravatar.cc/150?u=a042581f4e29026024d"
        }
      />
      <div className=" flex flex-col ">
        <span className=" font-semibold mx-2 text-sm ">
          {user?.name}
        </span>
      </div>
    </div>
  )
}

export default GroupSeachCard