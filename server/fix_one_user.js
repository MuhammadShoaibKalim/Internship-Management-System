import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/user.model.js';

const fixSpecificUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const userId = '69a56658813924109103125a';
        const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        const result = await User.findByIdAndUpdate(userId, { avatar: defaultAvatar });
        if (result) {
            console.log(`[SUCCESS] Fixed avatar for user ID: ${userId}`);
        } else {
            console.log(`[NULL] User ID: ${userId} not found or already fixed.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err.message);
        process.exit(1);
    }
};

fixSpecificUser();
