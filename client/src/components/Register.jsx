import { Form } from "react-router-dom";
import React, { useState } from "react";
import { Input, Button, Avatar, Tooltip } from "@nextui-org/react";
import { EyeFilledIcon } from "./Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import switchScreen from "../Atoms/authswitchatom";
import imageReader from "../Hooks/imageReader";
import CustomFetch from "../utils/CustomFetch";
import { toast } from "react-toastify";


const Register = () => {
  const [registerValue, setregValue] = useState({});
  const [loading, setloading] = useState(false);
  const { handleimageread, imageurl, setimageurl } = imageReader();
  const setswitch = useSetRecoilState(switchScreen);
  const profileref = useRef();
  const [isVisible, setIsVisible] = React.useState(false);
  const hadleimageSelction = () => {
    profileref.current.click();
  };

  const handleInput = (e) => {
    setregValue({
      ...registerValue,
      [e.target.name]: e.target.value,
    });
  };
  const handleRegister = async (e) => {
    {
      e.preventDefault();
      setloading(true);
      try {
        const registeringValue = {
          name: registerValue.name,
          email: registerValue.email,
          password: registerValue.password,
          profilepic: imageurl,
        };
        const res = await CustomFetch.post("/auth/register",registeringValue);
         console.log(res)
        toast.success(res.data?.message);
        setloading(false);
        setswitch('true')
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
        setloading(false);
      }
    }
  };
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="  backdrop-sepia-0 backdrop-blur-md p-6 sm:p-10 ">
      <form className=" w-[90vw] max-w-[280px] sm:max-w-[450px] flex flex-col  gap-6 ">
        <div>
          <input
            type="file"
            accept="image/*"
            name="profilepic"
            ref={profileref}
            className="hidden"
            onChange={handleimageread}
          />
          <Tooltip
            content="Select Profile Picture"
            placement="left"
            className=" bg-yellow-600 text-gray-100 rounded-md  "
          >
            <Avatar
              src={
                imageurl
                  ? imageurl
                  : "https://i.pravatar.cc/150?u=a04258a2462d826712d"
              }
              className=" cursor-pointer w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] text-lg mx-auto  "
              onClick={hadleimageSelction}
            />
          </Tooltip>
        </div>
        <div className=" ">
          <Input
            name="name"
            radius={"none"}
            value={registerValue.name ? registerValue.name : ""}
            type="text"
            placeholder="Enter your name"
            className=" bg-gray-200  text-zinc-950 "
            onChange={handleInput}
          />
        </div>
        <div className="">
          <Input
            name="email"
            value={registerValue.email? registerValue.email:""}
            radius={"none"}
            type="email"
            placeholder="Enter your email"
            className=" bg-gray-200  text-zinc-950 "
            onChange={handleInput}
          />
        </div>
        <div className="">
          <Input
            name="password"
            value={registerValue.password? registerValue.password:""}
        
            placeholder="Enter your password"
            onChange={handleInput}
            classNames={{
              input:[
                'hover:outline-none'
              ]
            }}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="bg-gray-200 text-black hover:outline-none "
          />
        </div>

        <Button
          radius="none"
          className="  bg-zinc-700 hover:bg-zinc-800 transition-all  text-gray-100 w-full "
          onClick={handleRegister}
        >
          {loading ? "Loading..." : "Register"}
        </Button>
        <div className="">
          <span className=" text-gray-200 text-sm  ">
            Already have an account?{" "}
            <Link
              onClick={() => setswitch(true)}
              className=" cursor-pointer  text-yellow-600 "
            >
              login
            </Link>{" "}
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
