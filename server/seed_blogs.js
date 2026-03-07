import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import Blog from './models/blog.model.js';
import User from './models/user.model.js';

const blogs = [
    {
        title: 'Mastering the Industrial Transition',
        content: '<h2>Step into the Professional World</h2><p>Transitioning from academia to industry is more than just a change of scenery. It requires a shift in mindset, from theoretical problem-solving to practical, impact-driven execution...</p><p>Key strategies include building a professional network, understanding workplace culture, and continuous skill upscaling.</p>',
        excerpt: 'Navigating the gap between academic theory and industrial practice with professional strategies.',
        category: 'Career Advice',
        status: 'published',
        readTime: 6,
        tags: ['career', 'transition', 'professionalism'],
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Top 5 Skills Industry Partners Look For in 2026',
        content: '<h2>The 2026 Skill Matrix</h2><p>As the internship landscape evolves, specific competencies have moved from "nice-to-have" to "essential". Academic excellence is the baseline, but industrial success depends on...</p><ul><li>Agile Project Management</li><li>Cross-functional Communication</li><li>Technical Adaptability</li><li>Data-Driven Decision Making</li><li>Problem Ownership</li></ul>',
        excerpt: 'Identify the core competencies that will make your internship application stand out to premium firms.',
        category: 'Technical Skills',
        status: 'published',
        readTime: 4,
        tags: ['skills', '2026', 'hiring'],
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'How to Build a Standout Portfolio during your Internship',
        content: '<h2>Documenting for Success</h2><p>Your internship is not just a time to learn; it is a time to build evidence of your capability. Every task you complete and every problem you solve is a potential case study for your future career...</p>',
        excerpt: 'Strategy on how to effectively document and present your internship achievements for future employers.',
        category: 'Internship Tips',
        status: 'published',
        readTime: 5,
        tags: ['portfolio', 'internship', 'documentation'],
        coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200'
    }
];

const seedBlogs = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI ? 'URI FOUND' : 'NOT FOUND');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected...');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin found to assign as author');
            process.exit(1);
        }

        await Blog.deleteMany();
        console.log('Existing blogs cleared.');

        const blogsWithAuthor = blogs.map(b => ({ ...b, author: admin._id }));
        await Blog.insertMany(blogsWithAuthor);

        console.log('Seeded 3 blogs successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed Failed:', err.message);
        process.exit(1);
    }
};

seedBlogs();
