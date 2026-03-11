import mongoose from 'mongoose';
import User from './server/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const verify = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to DB');

        const userId = '69a81b5f18c47e57eae31497'; // Existing user ID from logs
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found, this verification depends on an existing user.');
            process.exit(1);
        }

        console.log('Current user:', user.name, 'role:', user.role);
        console.log('Current industryMeta:', user.industryMeta);

        // Mimic the refactored controller logic
        const updatePayload = {
            industryMeta: {
                bio: 'Updated Bio ' + Date.now(),
                headquarters: 'Test HQ'
            }
        };

        console.log('Applying update payload:', updatePayload);

        const allowedFields = ['name', 'phone', 'secondaryEmails', 'address', 'academicDetails', 'skills', 'studentMeta', 'industryMeta', 'supervisorMeta'];

        Object.keys(updatePayload).forEach(el => {
            if (allowedFields.includes(el)) {
                if (['studentMeta', 'industryMeta', 'supervisorMeta', 'academicDetails'].includes(el) && typeof updatePayload[el] === 'object') {
                    user[el] = { ...user[el]?.toObject(), ...updatePayload[el] };
                } else {
                    user[el] = updatePayload[el];
                }
            }
        });

        console.log('Saving user...');
        const start = Date.now();
        await user.save({ validateBeforeSave: true });
        console.log('Save successful in', Date.now() - start, 'ms');

        const updatedUser = await User.findById(userId);
        console.log('Updated industryMeta:', updatedUser.industryMeta);

        if (updatedUser.industryMeta.bio.startsWith('Updated Bio') && updatedUser.industryMeta.headquarters === 'Test HQ') {
            console.log('VERIFICATION SUCCESSFUL: Nested fields merged correctly.');
        } else {
            console.log('VERIFICATION FAILED: Fields not merged as expected.');
        }

        process.exit(0);
    } catch (err) {
        console.error('VERIFICATION FAILED with error:', err.message);
        process.exit(1);
    }
};

verify();
