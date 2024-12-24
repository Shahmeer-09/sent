const jwt = require("jsonwebtoken");

const {StatusCodes} = require("http-status-codes")
const {UnauthenticatedError}= require("../utils/CusrtomErrors")
const User = require("../model/user.model");
const verifyjwt = async (req, res, next) => {
  try {
    const accesstoken =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accesstoken) {
      throw new UnauthenticatedError(
        "you are not authenticated as no token found to verify"
      );
    }
    const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN);
    const user = await User.findById(decoded?._id).select("-password");
    if (!user) {
      throw new UnauthenticatedError(
        "you are not authenticated as no user found"
      );
    }
  
    req.user = user;
    next()
  } catch (error) {
    throw new UnauthenticatedError(
      "you are not authenticated bay"
    );
  }
};

module.exports =  verifyjwt;
