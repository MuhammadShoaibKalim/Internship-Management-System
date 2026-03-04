import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Internship from '../models/internship.model.js';
import connectDB from '../config/db.js';

dotenv.config();

const migrate = async () => {
    try {
        await connectDB();

        console.log('--- Internship Migration Started ---');

        const total = await Internship.countDocuments();
        console.log(`Total internships found: ${total}`);

        const drafts = await Internship.countDocuments({ status: 'draft' });
        console.log(`Draft internships to be updated: ${drafts}`);

        const result = await Internship.updateMany(
            { status: 'draft' },
            { $set: { status: 'open' } }
        );

        console.log(`Successfully updated ${result.modifiedCount} internships to 'open' status.`);
        console.log('--- Migration Completed ---');

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
