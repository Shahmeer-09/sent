import { atom } from "recoil";

const UserAtom =atom({
    key:'userdata',
    default:localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
})

export default UserAtom 