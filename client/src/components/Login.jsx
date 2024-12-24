import { toast } from 'react-toastify';
import React, { useState } from "react";
import { Input, Button, Avatar, input } from "@nextui-org/react";
import { EyeFilledIcon } from "./Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon";
import { Link } from "react-router-dom";
import switchScreen from "../Atoms/authswitchatom";
import { useSetRecoilState } from "recoil";
import CustomFetch from "../utils/CustomFetch";
import { useNavigate } from 'react-router-dom';
import ForgetPasswordmodel from './Forgetapsswordmodel'

const Login = () => {
  const [inputvalue, setinputvalues] = useState({});

  const setswitch = useSetRecoilState(switchScreen);

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setloading] =  useState(false)
  const navigate = useNavigate()
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handlechange = (e) => {
    setinputvalues({ ...inputvalue, [e.target.name]:e.target.value});
  };
  const handlelogin = async (e) => {
       e.preventDefault()
       setloading(true)
       try {
           const response  =  await CustomFetch.post('/auth/login',inputvalue)
           navigate('/')
           toast.success(response.data?.message)
           sessionStorage.setItem("user", JSON.stringify(response?.data.data))
           setloading(false)
       } catch (error) {
           toast.error(error?.response?.data?.message || error.message)
          setloading(false)
       }
  };
  const handleTest = async (e) => {
       e.preventDefault()
       setloading(true)
       try {
           const response  =  await CustomFetch.post('/auth/login',{
            email:"shahmeerweb@gmail.com",
            password:"shahmeer@123"
           })
           navigate('/')
           toast.success(response.data?.message)
           sessionStorage.setItem("user", JSON.stringify(response?.data.data))
           setloading(false)
       } catch (error) {
           toast.error(error?.response?.data?.message || error.message)
          setloading(false)
       }
  };

  
  return (
    <div className="  backdrop-sepia-0 backdrop-blur-md  p-6 sm:p-10">
      <h3 className="   font-sans font-medium text-yellow-400  text-center mb-6">
        {" "}
        Login{" "}
      </h3>
      <form
        className=" w-[90vw] max-w-[280px] sm:max-w-[450px] flex flex-col  gap-6 "
      >
        <div className="">
          <Input
            name="email"
            value={inputvalue.email? inputvalue.email : "" }
            onChange={handlechange}
            radius={"none"}
            type="email"
            variant='borderd'
            placeholder="Enter your email"
            className=' text-zinc-700  bg-transparent '
             
          />
        </div>
        <div className="">
          <Input
            name="password"
            value={inputvalue.password ? inputvalue.password : ""}
            onChange={handlechange}
            // variant="bordered"
            placeholder="Enter your password"
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
            className="bg-gray-200 text-black  "
          />
        </div>
        <div className="">
          <ForgetPasswordmodel/>
        </div>
         <Button  type="submit"
          onClick={handleTest}
          radius="none"
          className="  bg-zinc-700 hover:bg-zinc-800 transition-all  text-gray-100 w-full ">Test the app</Button>
        <Button
          type="submit"
          onClick={handlelogin}
          radius="none"
          className="  bg-zinc-700 hover:bg-zinc-800 transition-all  text-gray-100 w-full "
        >
        {loading ? "Loging..." : "Sign in"}
        </Button>
        <div className="">
          <span className=" text-gray-200 text-sm  ">
            Dont have an account?
            <Link
              onClick={() => setswitch(false)}
              className=" cursor-pointer  text-yellow-600 "
            >

              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
