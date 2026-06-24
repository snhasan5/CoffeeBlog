const User = require("../models/user.models");
const emailUtil = require("../utils/email");
const resetPass = require("../utils/reset-pass");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
module.exports.getLoginPage = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Now",
    activePage: "/login",
    errorMessage: req.flash("error"),
  });
};

module.exports.getSignupPage = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    activePage: "/signup",
  });
};

module.exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.redirect("/login");
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
      console.log(err);
    });
};

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "No User Found! (Incorrect Email or Password)");
        return res.redirect("/login");
      } else {
        bcrypt.compare(password, user.password).then((doMatch) => {
          console.log(doMatch);
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              return res.redirect("/");
            });
          } else return res.redirect("/login");
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports.getResetPage = (req, res, next) => {
  const errorMessage = req.flash("error")
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
        console.log(err);
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
      console.log(err);
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
