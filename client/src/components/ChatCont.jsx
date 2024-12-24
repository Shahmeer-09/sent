import React from 'react'
import ChatSecction from './ChatSecction'
import Selected from '../Atoms/SelectedChat'
import { useRecoilValue } from 'recoil'

const ChatCont = () => {
  const seleted = useRecoilValue(Selected)
  return (
    <div className= {` h-screen  px-8 py-6  ${seleted? "block":"hidden"}   bg-zinc-800  sm:block sm:col-start-2 col-span-2 `}  >
       <ChatSecction/>
    </div>
  )
}

export default ChatCont