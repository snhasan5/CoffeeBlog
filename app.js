const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');
const dns = require('dns');
const User = require('./models/user.models')
const Blog = require('./models/blog.models')
const blogRoutes = require('./routes/blog.routes');
const authRoutes = require('./routes/auth.routes');
const Router  = require('./routes/blog.routes');
const MONGOURI = 'mongodb+srv://hasan:hasan@cluster0.usoqi86.mongodb.net/blog?retryWrites=true&w=majority';
const { MongoStore } = require('connect-mongo');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const store = MongoStore.create({
     mongoUrl: MONGOURI,
     collectionName: 'sessions'
})
const session = require('express-session');
const app = express();
app.use(
    session({
        secret: 'bloged up',
        resave: false,
        saveUninitialized : false,
        store : store
    })
)
app.use(express.urlencoded({extended:  true}));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));


app.use(blogRoutes);
app.use(authRoutes);

app.use((req,res,next)=>{
    
})

mongoose.connect(MONGOURI)
.then(()=>{
    User.findOne()
    .then(user=>{
        if(!user){
            const newUser = new User(
                {
                username : "Hasan@123",
                email:'hasan@gmial.com',
                name: 'Sayyed'
                }
            )
            return newUser.save();
        }
    }).then((finalUser)=>{

        app.listen(3000) ; 
    }).catch(err =>{
        console.log(err);
    })
})