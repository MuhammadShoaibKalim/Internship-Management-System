import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/user.model.js';

const syncAvatars = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const users = await User.find({ avatar: { $regex: /uploads\/avatars/ } });
        console.log(`Checking ${users.length} users with local avatars...`);

        let fixedCount = 0;
        const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        for (const user of users) {
            // Extract filename from URL (e.g., http://localhost:4000/uploads/avatars/avatar-xxx.png)
            const parts = user.avatar.split('/');
            const filename = parts[parts.length - 1];
            const filePath = path.join(__dirname, 'public/uploads/avatars', filename);

            if (!fs.existsSync(filePath)) {
                console.log(`[FIX] File missing for user ${user.email}: ${filename}`);
                user.avatar = defaultAvatar;
                await user.save({ validateBeforeSave: false });
                fixedCount++;
            }
        }

        console.log(`\nCleanup Complete! Fixed ${fixedCount} broken avatar links.`);
        process.exit(0);
    } catch (err) {
        console.error('Cleanup Failed:', err.message);
        process.exit(1);
    }
};

syncAvatars();
