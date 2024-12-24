import React from 'react'
import Picker  from "emoji-picker-react"
const EmojiPicker = ({ setmessage, message}) => {
  return (
    <div className=" absolute sm:h-[300px] w-[250px] h-[280px] rounded-lg  bg-zinc-800 text-white sm:w-[300px] bottom-16  left-0 sm:left-[-13px]  ">
        <Picker theme='dark' searchDisabled height={"100%"} width={"100%"} onEmojiClick={(emoji)=> setmessage( message + emoji.emoji )}  />
    </div>
  )
}

export default EmojiPicker