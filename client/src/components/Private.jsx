import React from 'react'
import UserAtom from '../Atoms/UserAtom'
import { useRecoilValue } from 'recoil'
const Private = () => {
    const user = useRecoilValue(UserAtom)
     console.log(user);
  return (
    <div>Private</div>
  )
}

export default Private