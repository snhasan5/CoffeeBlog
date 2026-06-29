const Blog = require("../models/blog.models");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const PDFDocument = require("pdfkit");

module.exports.getIndexPage = (req, res, next) => {
  res.render("notes/index", {
    activePage: "/",
    pageTitle: "Home",
  });
};
module.exports.getBlogPage = (req, res, next) => {
  Blog.find().then((blogs) => {
    console.log(req.session);

    res.render("notes/blog", {
      activePage: "/blogs",
      blogs: blogs,
      pageTitle: "Blogs",
    });
  });
};

module.exports.getFullBlog = (req, res, next) => {
  Blog.findById(req.params.blogId)
    .populate("userId")
    .then((blog) => {
      if (!blog) {
        return res
          .status(404)
          .render("error/404", { pageTitle: "Blog Not Found" });
      }
      res.render("notes/full-blog", {
        pagetitle: blog.title,
        activePage: "/blogs",
        blog: blog,
      });
    })
    .catch((err) => next(err));
};

module.exports.getMyBlogpage = (req, res, next) => {
  console.log("In get my blogs----------------<", req.user);
  req.user.getMyBlogs().then((blogs) => {
    console.log(typeof blogs);
    res.render("notes/myblogs", {
      activePage: "/myblogs",
      blogs: blogs,
      pageTitle: "My Blogs",
    });
  });
};

module.exports.getMyAddPage = (req, res, next) => {
  res.render("notes/edit-blog", {
    activePage: "/add-blogs",
    editing: false,
    author: req.user.name,
    pageTitle: "Add Blog",
    enteredValue: {
      title: "",
      content: "",
      imageUrl: "",
      color: "",
    },
    errorMessage: "",
    validationErrors: [],
  });
};

module.exports.postMyBlog = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;
  const color = req.body.color;
  const author = req.body.author;
  const userId = req.user._id;
  if (!image) {
    console.log("EFOWWWWWWWWWWWWWWWWWWWWWWfnowhqpwwwwwww");
    return res.status(400).render("notes/edit-blog", {
      activePage: "/add-blogs",
      editing: false,
      author: req.user.name,
      pageTitle: "Add Blog",
      enteredValue: {
        title: title,
        content: content,
        color: color,
      },
      errorMessage: "Attached file is not an Image!",
      validationErrors: [],
    });
  } else console.log(image);
  const errors = validationResult(req);
  console.log(errors.array());
  const errorArray = errors.array();
  if (!errors.isEmpty()) {
    return res.status(400).render("notes/edit-blog", {
      activePage: "/add-blogs",
      editing: false,
      author: req.user.name,
      pageTitle: "Add Blog",
      enteredValue: {
        title: title,
        content: content,
        image: image,
        color: color,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errorArray,
    });
  }
  const imageUrl = image.path;

  const newBlog = new Blog({
    title: req.body.title,
    content: req.body.content,
    imageUrl: imageUrl,
    color: req.body.color,
    author: req.body.author,
    userId: req.user._id,
  });
  return newBlog
    .save()
    .then(() => {
      res.redirect("/myblogs");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports.postDeleteBlog = (req, res, next) => {
  let blogId = req.params.blogId;

  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res
          .status(404)
          .render("error/404", { pageTitle: "Blog Not Found" });
      }
      if (blog.userId.toString() !== req.user._id.toString()) {
        return res.status(403).render("error/403", { pageTitle: "Forbidden" });
      }
      let imagePath = blog.imageUrl;

      return Blog.findByIdAndDelete(blogId)
      .then(() => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.redirect("/myblogs");
        });
      })
    })
      .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports.getEditPage = (req, res, next) => {
  let blogId = req.params.blogId;
  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res
          .status(404)
          .render("error/404", { pageTitle: "Blog Not Found" });
      }
      if (blog.userId.toString() !== req.user._id.toString()) {
        return res.status(403).render("error/403", { pageTitle: "Forbidden" });
      }
      res.render("notes/edit-blog", {
        activePage: "/edit-blogs",
        editing: true,
        author: req.user.name,
        pageTitle: "Edit Blog",
        blog: blog,
        errorMessage: "",
        validationErrors: [],
      });
    })
    .catch((err) => next(err));
};

module.exports.postEditPage = (req, res, next) => {
  const errors = validationResult(req);
  console.log("ERROROROROR:", errors.array());
  const blogId = req.params.blogId;
  if (!errors.isEmpty()) {
    return Blog.findById(blogId)
      .then((blog) => {
        if (blog) {
          return res.render("notes/edit-blog", {
            activePage: "/edit-blogs",
            editing: true,
            author: req.user.name,
            pageTitle: "Edit Blog",
            blog: blog,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res
          .status(404)
          .render("error/404", { pageTitle: "Blog Not Found" });
      }
      if (blog.userId.toString() !== req.user._id.toString()) {
        return res.status(403).render("error/403", { pageTitle: "Forbidden" });
      }
      const image = req.file;
      if (!image) {
        console.log("IMAGE EROROROR------------...............");
        return res.render("notes/edit-blog", {
          activePage: "/edit-blogs",
          editing: true,
          author: req.user.name,
          pageTitle: "Edit Blog",
          blog: blog,
          errorMessage: "Image file must be uploaded!",
          validationErrors: [],
        });
      }
      return Blog.findByIdAndUpdate(req.params.blogId, {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
        color: req.body.color,
      }).then(() => {
        res.redirect("/myblogs");
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports.getBlog = (req, res, next) => {
  const blogId = req.params.blogId;
  Blog.findOne({ userId: req.user._id })
    .then((blog) => {
      console.log("dede");
      if (!blog) {
        throw new Error("Invalid User");
      }
      const blogName = "blog-" + blogId + ".pdf";
      const blogPath = path.join("data", "blogs", blogName);
      // fs.readFile(blogPath, (err, data) => {
      //   if (err) {
      //     console.log("ERROR", err);
      //     return next(err);
      //   }

      // }
      // );
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(blogPath));
      pdfDoc.pipe(res);
      pdfDoc.text("DLROW OLLEH");
      // res.send(data);
      pdfDoc.end();
      ``;
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
