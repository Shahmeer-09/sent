import SpinnerV from "../components/SpinnerV";
import React, { Suspense, useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import CustomFetch from "../utils/CustomFetch";
import UserAtom from "../Atoms/UserAtom";
import { useRecoilState, useSetRecoilState } from "recoil";

const Home = () => {
  console.log("home")
  return (
    <Suspense fallback={<SpinnerV />}>
      <Outlet />
    </Suspense>
  );
};

export default Home;
