const express = require('express');
const blogController = require('../controllers/blogController');
const isAuth = require('../utils/is-auth');
const blogValidate = require('../validators/blog.validate').blogValidator;
const router = express.Router();

router.get('/', blogController.getIndexPage);
router.get('/blogs',isAuth, blogController.getBlogPage);
router.get('/blogs/:blogId',blogController.getFullBlog);
router.get('/myblogs',isAuth, blogController.getMyBlogpage);
router.get('/add-blog',isAuth, blogController.getMyAddPage);
router.post('/add-blog',blogValidate,blogController.postMyBlog);
router.get('/edit-blog/:blogId',isAuth, blogController.getEditPage);
router.post('/edit-blog/:blogId',blogController.postEditPage);
router.post('/delete-blog/:blogId',blogController.postDeleteBlog)

module.exports = router