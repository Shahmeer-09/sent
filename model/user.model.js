const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min:[4],
      max:[10],
      required: true,
    },
    profilepic: {
      type: String,
      default:
        "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    profilepublic: {
      type:String,
      default: "",
    },
    otp: {
      type: String,
      default: "",
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);
userSchema.methods.hashOTcompare=async function(value){
      const user = this
      return await bcrypt.compare(value, user.otp)
}
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};
userSchema.methods.accessToken = function () {
  const user = this;
  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1day" }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
