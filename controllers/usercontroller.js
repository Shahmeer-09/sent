const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");
const Apiresponse = require("../utils/Apiresponse");
const { badReqError, NotfoundError } = require("../utils/CusrtomErrors");
const { generateOtp } = require("../utils/genrateOtp");
const Uploadoncloudinary = require("../utils/uploadCloudinary");
const sendMail = require("../utils/Nodemailer");
const Hashvlaue = require("../utils/Encryptotp");
const dayjs = require("dayjs");

const current = async (req, res) => {
  const userID = req.user._id;
  const user = await User.findById(userID).select("-password");
  res.status(200).json(new Apiresponse(StatusCodes.OK, user, ""));
};
const register = async (req, res, next) => {
  const { name, email, password, profilepic } = req.body;
  const user = await User.create({ name, email, password });
  if (profilepic) {
    picuploaded = await Uploadoncloudinary(profilepic);
    user.profilepic = picuploaded?.profilepic;
    user.profilepublic = picuploaded?.profilepublic;
  }
  await user.save();
  res
    .status(201)
    .json(new Apiresponse(StatusCodes.OK, null, "user registered scuccefully"));
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new badReqError("user not found");
  }
  
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new badReqError("wrong password ");
  }
  const accesstoken = user.accessToken();
  const oneday = 1000 * 60 * 60 * 24;
  const options = {
    httpOnly: true,
    maxAge: new Date(Date.now() + oneday),
    secure: process.env.NODE_ENV === "production",    
  };
  const {password:pass,...rest} = user._doc
  res
    .cookie("accesstoken", accesstoken, options)
    .status(200)
    .json(new Apiresponse(StatusCodes.OK, rest, "user logged in scuccefully"));
};
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new badReqError("email is required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new badReqError("user not found");
  }
  user.otp = "";
  user.otpExpires = "";
  const getOtp = await generateOtp();

  const espiretime = Date.now() + 15 * 60 * 1000;
  const displayTime = espiretime - Date.now();
  const fromattedtime = dayjs(displayTime).format("mm:ss");
  const options = {
    from: `"From ${process.env.EMAIL_USER}`,
    to: user.email,
    subject: "Get verifivation code for email",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Display</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 20px 0;
    }
    .message {
      font-size: 16px;
      color: #666;
    }
  
  </style>
</head>
<body>
  <div class="container">
    <h1>Verification Code</h1>
    <p class="message">Please use the following OTP to complete your verification:</p>
    <p class="otp" id="otp">${getOtp}</p>
    <p > Expires in  ${fromattedtime}m</p>
  </div>

</body>
</html>`,
  };

  await sendMail(options);
  const hashedotp = await Hashvlaue(`${getOtp}`);
  console.log(hashedotp);
  // const user1= await User.findOne({ email });
  user.otp = hashedotp;
  user.otpExpires = espiretime;
  await user.save();
  res
    .status(200)
    .json(new Apiresponse(StatusCodes.OK, null, "otp send successfully"));
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new badReqError("email and otp are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new badReqError("user this with not found");
  }
  const currentTime = Date.now();
  console.log(currentTime);
  console.log(user.otpExpires);
  if (currentTime < user.otpExpires) {
    const isCorrectOtp = await user.hashOTcompare(otp);
    if (!isCorrectOtp) {
      throw new badReqError("Invalid OTP");
    }
  } else {
    user.otp = "";
    user.otpExpires = "";
    throw new badReqError("OTP has expired");
  }
  res
    .status(200)
    .json(new Apiresponse(StatusCodes.OK, null, "otp verified successfully"));
};
const ChangePassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new badReqError("user not found");
  }
  user.password = password;
  await user.save();
  res
    .status(200)
    .json(
      new Apiresponse(StatusCodes.OK, null, "password changed successfully")
    );
};

const SearchUser = async (req, res) => {
  const search = req.body.search;
  if (!search) throw new badReqError("search is required");
  console.log(search)
  const user = await User.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("-password").limit(6);
   if(user?.find(u=>u._id.toString()=== req.user?._id.toString())){
     user.splice(user.findIndex(u=>u._id.toString()=== req.user?._id.toString()),1)
   }
   console.log(user)
  if (user?.length ==0){
     throw new NotfoundError("user not found")
  };
  res.status(200).json(new Apiresponse(StatusCodes.OK, user, "User Found "));
};
const Logout= (req, res)=>{
    res.cookie("accesstoken", "", {
        maxAge: 1,
    }).status(200).json(new Apiresponse(StatusCodes.OK, null, "User Logout"))
}
module.exports = {
  register,
  login,
  current,
  sendOtp,
  verifyOtp,
  ChangePassword,
  SearchUser,
  Logout
};
