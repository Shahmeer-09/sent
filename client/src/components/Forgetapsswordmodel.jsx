import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

import { MailIcon } from "./Icons/MailIcon";
import OtpInput from "react-otp-input";
import { EyeFilledIcon } from "./Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./Icons/EyeSlashFilledIcon";
import { toast } from "react-toastify";
import CustomFetch from "../utils/CustomFetch";

export default function ForgetPasswordmodel() {
  const { isOpen, onOpen, onClose ,  onOpenChange } = useDisclosure();
  const [val, setVal] = useState("");
  const [passwordState, setpasswordState] = useState(false);
  const [resend, setRensend] = useState(true)
  const [password, setpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [emailval, setemailVal] = useState("");
  const [isLoading, setisloading] = useState(false);
  const [otpstate, setotpstate] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleSendOTp = async (e) => {
    e.preventDefault()
    try {
      setisloading(true);
      const response = await CustomFetch.post("/auth/getOtp", {
        email: emailval,
      });
      toast.success(response.data?.message, {
        theme: "dark",
      });
      setotpstate(true);
      setisloading(false);
      onOpen();
      setRensend(true)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message, {
        theme: "dark",
        autoClose: 2000,
      });
      onOpen();
      setotpstate(false);
      setisloading(false);
      setRensend(false)
      setemailVal("")
    }
  };
  const hnandleOTPVerify = async (e) => {
    e.preventDefault()
    try {
      setisloading(true);
      const response = await CustomFetch.post("/auth/verifyOtp", {
        email: emailval,
        otp: val,
      });
      toast.success(response.data?.message, {
        theme: "dark",
      });
      setpasswordState(true);
      setotpstate(false);
      setisloading(false);
      setVal("");
      onOpen();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message, {
        theme: "dark",
        autoClose: 2000,
      });
      setisloading(false);
      setVal("");
      setpasswordState(false);
      setRensend(false)
    }
  };
  const isInvalid = React.useMemo(() => {
    return password == confirmpassword ? false : true;
  }, [confirmpassword]);
  const handleSendpassword =async (e)=>{
    e.preventDefault()
     try {
       setisloading(true)
       const response = await CustomFetch.post("/auth/changepwd", {
        email: emailval,
        password:confirmpassword
      });
      toast.success(response.data?.message, {
        theme: "dark",
      });
      setpasswordState(false);
      setemailVal("")
      setisloading(false);
      onClose();
     } catch (error) {
      toast.error(error?.response?.data?.message || error.message, {
        theme: "dark",
      });
      setisloading(false);
      setpasswordState(true)
      onOpen()
     }
  }
  return (
    <>
      <span
        onClick={onOpen}
        className=" text-sm cursor-pointer text-yellow-600 "
      >
        {otpstate ? "verify otp... " : "forgot password? "}
      </span>
      <Modal
        className=" bg-zinc-700 text-gray-50  "
        isOpen={isOpen}
        backdrop="blur"
        onOpenChange={onOpenChange}
        placement="center"
      >
        {!otpstate && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Enter yout email to recieve otp
                </ModalHeader>
                <ModalBody>
                  <Input
                    //   autoFocus
                    endContent={
                      <MailIcon className="text-2xl   text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    radius="none"
                    type="email"
                    size="sm"
                    value={emailval}
                    onValueChange={setemailVal}
                    placeholder="Enter your email"
                    classNames={{
                      input: [" text-black "],
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={handleSendOTp}
                    color="primary"
                    isLoading={isLoading}
                  >
                    {isLoading ? "verifying.." : "verify your email"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {otpstate && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center ">
                  {" "}
                  Enter the OTP sent to your Email
                </ModalHeader>
                <ModalBody>
                  <OtpInput
                    value={val}
                    onChange={setVal}
                    numInputs={4}
                    renderSeparator={<span> </span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      fontSize: "20px",
                      textAlign: "center",
                      backgroundColor: "transparent",
                      border: "2px solid white",
                      outline: "none",
                    }}
                    containerStyle={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      margin: "20px",
                    }}
                  />
                </ModalBody>
                <ModalFooter  className=" flex justify-center content-center">
                  <Button onClick={hnandleOTPVerify} size="sm" color="primary" isLoading={isLoading}>
                    {isLoading ? "verifying.." : "verify otp"}
                  </Button>
                  <Button
                  size="sm"
                    color="danger"
                    onClick={() => {
                      setotpstate(false);
                      setemailVal("");
                    }}
                  >
                    Back
                  </Button>
                  <Button disabled={resend}  onClick={handleSendOTp} size="sm" color="primary">
                    resend otp
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
        {!otpstate && passwordState && (
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center ">
                  Enter the new password
                </ModalHeader>
                <ModalBody>
                  <Input
                    name="password"
                    value={password}
                    onValueChange={setpassword}
                    placeholder="Enter New password"
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
                  <Input
                    name="password"
                    value={confirmpassword}
                    onValueChange={setConfirmpassword}
                    placeholder="confirm new password"
                    isInvalid={isInvalid}
                    color={isInvalid ? "danger" : undefined}
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
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setotpstate(false);
                      setpasswordState(false);
                      onClose();
                      setemailVal("");
                    }}
                    color="primary"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendpassword}
                    size="sm"
                    color="primary"
                    isLoading={isLoading}
                  >
                    Create new Password
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
