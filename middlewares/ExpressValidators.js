const { body, validationResult, param } = require("express-validator");
const User = require("../model/user.model");
const { UnauthenticatedError, badReqError } = require("../utils/CusrtomErrors");
const { StatusCodes } = require("http-status-codes");

const validatorFunction = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors
          .array()
          .map((error) => error.msg).join(",")
          console.log(errorMessage)
        if (errorMessage[0].startsWith("wrong Credentials (email)")) {
          throw new UnauthenticatedError(errorMessage);
        }
        throw new badReqError(errorMessage);
      }
      next();
    },
  ];
};

module.exports.validateRegister = validatorFunction([
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Email is required")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new badReqError("user with this email already exists");
      }
    }),
  body("password")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage(
      "Password must 6-10 ch ,must contain atleast one uppercase & lowercase & symbols and numbers"
    ),
]);
module.exports.validateChangePassword = validatorFunction([
  body("email")
  .isEmail()
  .withMessage("Email is required"),
  body("password")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage(
      "Password must 6-10 ch ,must contain atleast one uppercase & lowercase & symbols and numbers"
    ),
]);
module.exports.validatelogin = validatorFunction([
  body("email")
    .isEmail()
    .withMessage(" Correct Email is required")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new UnauthenticatedError("wrong Credentials (email)");
      }
    }),
  body("password").notEmpty().withMessage("Password is required"),
]);
