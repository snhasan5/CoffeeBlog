const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');
const dns = require('dns');
const User = require('./models/user.models')
const Blog = require('./models/blog.models')
const blogRoutes = require('./routes/blog.routes');
const Router  = require('./routes/blog.routes');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const app = express();

app.use(express.urlencoded({extended:  true}));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findById('6a34c7a70cd9928d57ef7ef9')
    .then(user=>{
        req.user = user;
        console.log("ENTERED FIRST MIDDLEWARE-------------->",req.user);

       
        next();
    })
    .catch(err=>{
        console.log(err);
    });
}
)
app.use(blogRoutes)


mongoose.connect('')
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