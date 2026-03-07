import express from 'express';
import {
    getAllBlogs,
    getAllBlogsAdmin,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadBlogImageAction
} from '../controllers/blog.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadBlogImage } from '../utils/upload.utils.js';

const router = express.Router();

// Public Routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin Only Routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/admin/all', getAllBlogsAdmin);
router.post('/upload-image', uploadBlogImage, uploadBlogImageAction);
router.post('/', createBlog);
router.route('/:id')
    .patch(updateBlog)
    .delete(deleteBlog);


export default router;

