const Blog = require('../models/blog.models');
const { validationResult } = require('express-validator');
module.exports.getIndexPage = (req, res, next) => {
    res.render('notes/index', {
        activePage: '/',
        pageTitle: "Home"
    })
}
module.exports.getBlogPage = (req, res, next) => {
    Blog.find().then((blogs) => {
        console.log(req.session);

        res.render('notes/blog', {
            activePage: '/blogs',
            blogs: blogs,
            pageTitle: 'Blogs'
        })
    })

}

module.exports.getFullBlog = (req, res, next) => {
    console.log('PARAMS:----------->', req.params);
    Blog.findById(req.params.blogId).populate('userId').then((blog) => {
        if (!blog) {
            return res.status(404).render('error/404', { pageTitle: 'Blog Not Found' });
        }
        res.render('notes/full-blog', {
            pagetitle: blog.title,
            activePage: "/blogs",
            blog: blog
        })
    }).catch(err => next(err));
}

module.exports.getMyBlogpage = (req, res, next) => {
    console.log("In get my blogs----------------<", req.user);
    req.user
        .getMyBlogs().then((blogs) => {
            console.log(typeof (blogs))
            res.render('notes/myblogs', {
                activePage: '/myblogs',
                blogs: blogs,
                pageTitle: 'My Blogs'
            })
        })
}

module.exports.getMyAddPage = (req, res, next) => {
    res.render('notes/edit-blog', {
        activePage: '/add-blogs',
        editing: false,
        author: req.user.name,
        pageTitle: 'Add Blog',
        enteredValue:{
            title:'',
                content : '',
                imageUrl : '',
                color : ''
        },
        errorMessage : '',
        validationErrors : []
    })
}


module.exports.postMyBlog = (req, res, next) => {

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.imageUrl;
    const color = req.body.color;
    const author = req.body.author;
    const userId = req.user._id;
    const errors = validationResult(req);
        console.log(errors.array());
    const errorArray = errors.array();
    if (!errors.isEmpty()) {
        return res.status(400).render('notes/edit-blog', {
            activePage: '/add-blogs',
            editing: false,
            author: req.user.name,
            pageTitle: 'Add Blog',
            enteredValue: {
                title: title,
                content : content,
                imageUrl : imageUrl,
                color : color

         },
         errorMessage : errors.array()[0].msg,
         validationErrors : errorArray
        })
    }

    const newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        color: req.body.color,
        author: req.body.author,
        userId: req.user._id
    })
    return newBlog.save().then(() => {
        res.redirect('/myblogs')
    }).catch(err => {
        console.log(err);
        next(err);
    });
}

module.exports.postDeleteBlog = (req, res, next) => {
    let blogId = req.params.blogId;
    Blog.findById(blogId).then((blog) => {
        if (!blog) {
            return res.status(404).render('error/404', { pageTitle: 'Blog Not Found' });
        }
        if (blog.userId.toString() !== req.user._id.toString()) {
            return res.status(403).render('error/403', { pageTitle: 'Forbidden' });
        }
        return Blog.findByIdAndDelete(blogId).then(() => {
            res.redirect('/myblogs');
        });
    }).catch(err => {
        console.log(err);
        next(err);
    });
}

module.exports.getEditPage = (req, res, next) => {
    let blogId = req.params.blogId;
    Blog.findById(blogId).then((blog) => {
        if (!blog) {
            return res.status(404).render('error/404', { pageTitle: 'Blog Not Found' });
        }
        if (blog.userId.toString() !== req.user._id.toString()) {
            return res.status(403).render('error/403', { pageTitle: 'Forbidden' });
        }
        res.render('notes/edit-blog', {
            activePage: '/edit-blogs',
            editing: true,
            author: req.user.name,
            pageTitle: 'Edit Blog',
            blog: blog,
            errorMessage : '',
            validationErrors : []
        })
    }).catch(err => next(err));
}

module.exports.postEditPage = (req, res, next) => {
    console.log(req.body);
    Blog.findById(req.params.blogId).then((blog) => {
        if (!blog) {
            return res.status(404).render('error/404', { pageTitle: 'Blog Not Found' });
        }
        if (blog.userId.toString() !== req.user._id.toString()) {
            return res.status(403).render('error/403', { pageTitle: 'Forbidden' });
        }
        return Blog.findByIdAndUpdate(req.params.blogId, {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.imageUrl,
            color: req.body.color
        }).then(() => {
            res.redirect('/myblogs');
        });
    }).catch(err => {
        console.log(err);
        next(err);
    });
}
