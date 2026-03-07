import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A blog must have a title'],
        trim: true,
        unique: true
    },
    slug: String,
    content: {
        type: String,
        required: [true, 'A blog must have content']
    },
    excerpt: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        default: 'default-blog.jpg'
    },
    category: {
        type: String,
        enum: ['Career Advice', 'Technical Skills', 'Company Spotlight', 'Internship Tips', 'General'],
        default: 'General'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Blog must belong to an author']
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    readTime: {
        type: Number,
        default: 5
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexing for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// MIDDLEWARE: Create slug from title
blogSchema.pre('save', function (next) {
    if (!this.isModified('title')) return next();
    this.slug = slugify(this.title, { lower: true });
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
