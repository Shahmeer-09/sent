
const getSender = (users, current)=>{
   const sender= users[0]._id == current._id ? users[1] : users[0]; 
   return sender
}

const isSameSender = (msg, current)=>{
   try {
       return  msg?.sender?._id == current?._id
   } catch (error) {
      console.log(error)
   }
    
   }
export {getSender, isSameSender}