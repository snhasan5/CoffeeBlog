const User = require("../models/user.models");
const emailUtil = require("../utils/email")
const bcrypt = require("bcrypt");
module.exports.getLoginPage = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Now",
    activePage: "/login",
    errorMessage : req.flash('error')
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
        
        return res.redirect("/login");}
      else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const newUser = new User({
              name: req.body.name,
              email: email,
              password: hashedPassword,
            });
            return newUser.save()
            .then(()=>{
              return emailUtil.sendWelcomeEmail(email, name);
            })
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
      if (!user){
        req.flash('error','No User Found! (Incorrect Email or Password)')
        return res.redirect("/login");}
        else {
          bcrypt.compare(password, user.password)
          .then((doMatch) => {
            console.log(doMatch);
            if(doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err)=>{
              return res.redirect('/');
            })
          }
          else return res.redirect('/login')
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.postLogout = (req,res,next) =>{
    req.session.destroy((err)=>{
      console.log(err);
      res.redirect('/');
    })
}
