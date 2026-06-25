const { error } = require("console");
const User = require("../models/user.models");
const emailUtil = require("../utils/email");
const resetPass = require("../utils/reset-pass");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

module.exports.getLoginPage = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Now",
    activePage: "/login",
    errorMessage: req.flash("error"),
    enteredValue: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req).array();
  if (errors.length != 0) {
    return res.status(400).render("auth/login", {
      pageTitle: "Login Now",
      activePage: "/login",

      errorMessage: errors[0].msg,
      enteredValue: {
        email: email,
        password: password,
      },
      validationErrors: errors,
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
            return res.redirect("/");
          });
        } else {
          errors.push({
            type: "field",
            value: password,
            msg: "E-Mail or the password is incorrect!",
            path: "password",
            location: "body",
          });
          return res.status(400).render("auth/login", {
            pageTitle: "Login Now",
            activePage: "/login",
            errorMessage: errors[0].msg,
            enteredValue: {
              email: email,
              password: password,
            },
            validationErrors: errors,
          });
        }
      })
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getSignupPage = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    activePage: "/signup",
    errorMessage: req.flash("error"),
    enteredValue: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

module.exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    res.status(400).render("auth/signup", {
      pageTitle: "Sign Up",
      activePage: "/signup",
      errorMessage: errors.array()[0].msg,
      enteredValue: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash("error", "Email already exist !");
          return res.redirect("/signup");
        } else {
          return bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const newUser = new User({
                name: req.body.name,
                email: email,
                password: hashedPassword,
              });
              return newUser.save().then(() => {
                return emailUtil.sendWelcomeEmail(email, name);
              });
            })
            .then(() => {
              res.redirect("/login");
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports.getResetPage = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    activePage: "/reset",
    errorMessage: errorMessage.length > 0 ? errorMessage : null,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No User found ! ");
          return req.session.save(() => res.redirect("/reset"));
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user
          .save()
          .then((user) => {
            if (!user) {
              req.flash("error", "The user was not created");
              return;
            }
            return resetPass.sendResetEmail(email, token);
          })
          .then(() => {
            res.redirect("/login");
          });
      })
      .catch((err) => {
        next(err);
      });
  });
};

exports.getNewPasswordPage = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }

      res.render("auth/new-password", {
        pageTitle: "New Password",
        activePage: "/reset",
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
