import mongoose from 'mongoose';
import User from './server/models/user.model.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './server/.env' });

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const userId = '69a81b5f18c47e57eae31497'; // From the avatar filename in logs
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log('Updating user:', user.name, 'role:', user.role);

        const filteredBody = {
            name: user.name + ' (Test)'
        };

        console.log('Running findByIdAndUpdate with runValidators: true...');
        const start = Date.now();
        const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
            new: true,
            runValidators: true
        });
        console.log('Update successful in', Date.now() - start, 'ms');

        // Restore name
        await User.findByIdAndUpdate(userId, { name: user.name }, { runValidators: false });
        console.log('Restored original name');

        process.exit(0);
    } catch (err) {
        console.error('Update FAILED:', err);
        process.exit(1);
    }
};

test();
