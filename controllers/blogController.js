const Blog = require('../models/blog.models');

module.exports.getIndexPage = (req,res,next)=>{
    res.render('notes/index',{
        activePage : '/',
        pageTitle : "Home"
    })
}
module.exports.getBlogPage = (req,res,next)=>{
    Blog.find().then((blogs)=>{
            res.render('notes/blog',{
                activePage : '/blogs',
                blogs : blogs,
                pageTitle : 'Blogs'
            })
    })

} 

module.exports.getFullBlog = (req,res,next)=>{
    console.log('PARAMS:----------->',req.params);
    Blog.findById(req.params.blogId).populate('userId').then((blog)=>{
        res.render('notes/full-blog',{
            pagetitle: blog.title,
            activePage: "/blogs",
            blog: blog
        })
    })
}

module.exports.getMyBlogpage = (req,res,next)=>{
    req.user
    .getMyBlogs().then((blogs)=>{
        console.log(typeof(blogs))
        res.render('notes/myblogs',{
            activePage : '/myblogs',
            blogs : blogs,
            pageTitle : 'My Blogs'
        })
    })
}

module.exports.getMyAddPage = (req,res,next)=>{
    res.render('notes/edit-blog',{
        activePage : '/add-blogs',
        editing :false,
         author: req.user.name,
         pageTitle : 'Add Blog'
    })
}


module.exports.postMyBlog = (req,res,next)=>{
    const newBlog = new Blog({
        title : req.body.title,
        content : req.body.content,
        imageUrl : req.body.imageUrl,
        color : 'ORANGE',
        author : req.body.author,
        userId : req.user._id
    })
    return newBlog.save().then(()=>{
        res.redirect('/myblogs')
    }).catch(err =>{
        console.log(err);
    });
}

module.exports.postDeleteBlog = (req,res,next)=>{
    let blogId = req.params.blogId;
    return Blog.findByIdAndDelete(blogId).then(()=>{
      res.redirect('/myblogs');  
    }).catch(err =>{
        console.log(err);
    })
}

module.exports.getEditPage = (req,res,next)=>{
    let blogId = req.params.blogId;
        Blog.findById(blogId).then((blog)=>{
            res.render('notes/edit-blog',{
            activePage : '/edit-blogs',
            editing :true,
             author: req.user.name,
             pageTitle : 'Edit Blog',
             blog : blog
        })
        })
}

module.exports.postEditPage = (req,res,next)=>{
    console.log(req.body);
    Blog.findByIdAndUpdate(req.params.blogId,{
        title : req.body.title,
        content : req.body.content,
        imageUrl : req.body.imageUrl,
        color : req.body.color
    }).then(()=>{
        res.redirect('/myblogs');
    }).catch(err =>{
        console.log(err);
    })
}
