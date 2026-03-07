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
    coverImageWidth: {
        type: String,
        default: '100%'
    },
    coverImageHeight: {
        type: String,
        default: 'auto'
    },
    coverImageFit: {
        type: String,
        enum: ['cover', 'contain', 'fill'],
        default: 'cover'
    },
    contentImage: {
        type: String
    },
    contentImageWidth: {
        type: String,
        default: '100%'
    },
    contentImageHeight: {
        type: String,
        default: 'auto'
    },
    contentImageFit: {
        type: String,
        enum: ['cover', 'contain', 'fill'],
        default: 'cover'
    },
    allowSuggestions: {
        type: Boolean,
        default: false
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    showEngagement: {
        type: Boolean,
        default: true
    },
    likes: {
        type: Number,
        default: 0
    },
    relatedTopics: [
        {
            title: String,
            link: String,
            isCompleted: { type: Boolean, default: false }
        }
    ],
    category: {
        type: String,
        enum: ['Career Advice', 'Technical Skills', 'Company Spotlight', 'Internship Tips', 'General', 'Programming', 'Tutorial'],
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
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
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
