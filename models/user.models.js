const mongoose  = require('mongoose');
const Blog = require('./blog.models');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required : true 
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required : true
    }
})

userSchema.methods.getMyBlogs = function(){
    return Blog.find({userId : this._id})
    .populate('userId');
}


module.exports = mongoose.model('User',userSchema);