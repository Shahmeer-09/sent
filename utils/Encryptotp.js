const bcrypt = require("bcryptjs");

const Hashvlaue = async (value) => {
  try {
    const otp = await bcrypt.hash(value, 10);
    return otp;
  } catch (error) {
    throw error;
  }
};

module.exports = Hashvlaue;
