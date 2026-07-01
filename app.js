require("dotenv").config();

const express = require("express");
const path = require("path");
const { default: mongoose } = require("mongoose");
const dns = require("dns");
const User = require("./models/user.models");
const Blog = require("./models/blog.models");
const blogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const payRoutes = require("./routes/payment.routes")
const Router = require("./routes/blog.routes");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const flash = require('connect-flash');
const MONGOURI = process.env.MONGO_URI;
const { MongoStore } = require("connect-mongo");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const store = MongoStore.create({
  mongoUrl: MONGOURI,
  collectionName: "sessions",
});
const multer = require('multer');
const session = require("express-session");
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);
const {
  invalidCsrfTokenError,
  generateCsrfToken, 
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  getSessionIdentifier: (req) => req.session.id,
  getCsrfTokenFromRequest: (req) =>req.headers["x-csrf-token"] ||req.body._csrf  ,
 
});
const fileStorage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null,'images');
  },
  filename : (req,file,cb)=>{
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, timestamp + '-' + file.originalname);
  }
});
const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null,true);
  }
  else cb(null, false);
}
app.use(cookieParser());
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({storage : fileStorage, fileFilter : fileFilter}).single('image'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
})
app.use(doubleCsrfProtection);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req,res,next)=>{
  res.locals._csrf = generateCsrfToken(req, res); //because i used it here
  next();
})
app.use(blogRoutes);
app.use(authRoutes);
app.use(payRoutes);

app.use((req,res)=>{
  res.render('error/404',{
    activePage : '/404',

  })
})

app.use((error,req,res,next)=>{
  const wantsJson = req.accepts("json") && !req.accepts("html");
  const statusCode = error.statusCode || error.status || 500;

  res.locals.isAuthenticated = req.session && req.session.isLoggedIn;
  if (!res.locals._csrf && req.csrfToken) {
    res.locals._csrf = req.csrfToken();
  }

  if (wantsJson) {
    return res.status(statusCode).json({
      message: error.message || "Something went wrong"
    });
  }

  res.status(statusCode).render('error/500',{
    activePage :'/500'
  })
})

mongoose.connect(MONGOURI, { family: 4 }).then(() => {
      app.listen(process.env.PORT || 3000);
    })
    .catch((err) => {
      console.log(err);
    });
