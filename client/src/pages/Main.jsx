import React, { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
const AllChats = lazy(() => import("../components/AllChats"));
import ChatCont from "../components/ChatCont";
import CustomFetch from "../utils/CustomFetch";
import UserAtom from "../Atoms/UserAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Spinner } from "@nextui-org/react";
import SpinnerV from "../components/SpinnerV";
export const loader = async () => {
  try {
    const user = await CustomFetch.get("/auth/current");
    return user;
  } catch (error) {
    toast.error(error);
    localStorage.clear();
    return redirect("/authpage");
  }
};


const Main = () => {

  const[user, setUser] = useRecoilState(UserAtom);
  const {data}= useLoaderData();
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(data?.data?.name));
     setUser(data?.data)   
  } , [data]);
  return (
    <Suspense fallback={<SpinnerV />}>
      <div className="h-[100vh] w-[100vw] overflow-hidden   grid grid-cols-1 sm:grid-cols-3">
        <Suspense fallback={<Spinner color="default" size="lg" />}>
          <AllChats />
        </Suspense>
        <ChatCont />
      </div>
    </Suspense>
  );
};

export default Main;
