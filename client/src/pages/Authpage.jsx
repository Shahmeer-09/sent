import React from "react";
import switchScreen from "../Atoms/authswitchatom";
import Login from "../components/Login";
import Register from "../components/Register";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import UserAtom from "../Atoms/UserAtom";

const Authpage = () => {
  const switchvalue = useRecoilValue(switchScreen);
  return (
    <div className="flex bg-authpage bg-center  bg-cover bg-no-repeat  justify-center items-center h-screen text-white bg-gray-950   ">
      {switchvalue ? <Login /> : <Register />}
    </div>
  )
  
};

export default Authpage;
