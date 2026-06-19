const express = require('express');
const blogController = require('../controllers/blogController');
const router = express.Router();

router.get('/', blogController.getIndexPage);
router.get('/blogs',blogController.getBlogPage);
router.get('/blogs/:blogId',blogController.getFullBlog);
router.get('/myblogs',blogController.getMyBlogpage);
router.get('/add-blog',blogController.getMyAddPage);
router.post('/add-blog',blogController.postMyBlog);
router.get('/edit-blog/:blogId',blogController.getEditPage);
router.post('/edit-blog/:blogId',blogController.postEditPage);
router.post('/delete-blog/:blogId',blogController.postDeleteBlog)

module.exports = router