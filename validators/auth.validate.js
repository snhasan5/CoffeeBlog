const { body } = require("express-validator");
const User = require("../models/user.models");
exports.signupValidator = [
  body("email")
    .isEmail()
    .withMessage("This is not a valid email!")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      if (!value.endsWith("@gmail.com"))
        throw new Error("This domain is not valid!");
      return true;
    })
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error("This email already exist!");
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim()
    .withMessage("Password must have 6 characters!"),
  body("confirmPassword", "Enter the same password !")
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim()
    .custom((value, { req }) => {
      if (value === req.body.password) return true;
      else return false;
    }),
];

exports.loginValidator = [
  body("email")
    .isEmail()
    .withMessage("This is not a valid E-Mail!")
    .custom(async (value, { req }) => {
      if (!value.endsWith("@gmail.com"))
        throw new Error("This domain is not valid!");
      return true;
    })
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) return Promise.reject("E-Mail not found!");
      });
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must have 6 characters!"),
];
