import Blog from '../models/blog.model.js';
import catchAsync from '../utils/catchAsync.utils.js';
import AppError from '../utils/appError.utils.js';

// 0. Get All Blogs (Admin — includes drafts)
export const getAllBlogsAdmin = catchAsync(async (req, res, next) => {
    const filter = {};

    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }
    if (req.query.category) {
        filter.category = req.query.category;
    }
    if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
    }

    const blogs = await Blog.find(filter)
        .populate('author', 'name avatar')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        data: { blogs }
    });
});

// 1. Get All Blogs (Public)
export const getAllBlogs = catchAsync(async (req, res, next) => {
    const filter = { status: 'published' };

    // Search filter
    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
        filter.category = req.query.category;
    }

    const blogs = await Blog.find(filter)
        .populate('author', 'name avatar')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        data: { blogs }
    });
});

// 2. Get Single Blog by Slug (Public)
export const getBlogBySlug = catchAsync(async (req, res, next) => {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name avatar');

    if (!blog) {
        return next(new AppError('No blog found with that slug', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { blog }
    });
});

// 3. Create Blog (Admin Only)
export const createBlog = catchAsync(async (req, res, next) => {
    if (!req.body.author) req.body.author = req.user.id;

    const newBlog = await Blog.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { blog: newBlog }
    });
});

// 4. Update Blog (Admin Only)
export const updateBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { blog }
    });
});

// 5. Delete Blog (Admin Only)
export const deleteBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
