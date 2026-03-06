import mongoose from 'mongoose';
import User from './models/user.model.js';
import Application from './models/application.model.js';
import dotenv from 'dotenv';
dotenv.config();

const diag = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- DB DIAGNOSTICS ---');

        // 1. Check all pending applications
        const apps = await Application.find({ status: 'applied' }).populate('student');
        console.log(`Total 'applied' applications found: ${apps.length}`);

        apps.forEach((app, i) => {
            console.log(`\nApp ${i + 1}:`);
            console.log(`  Student Name: ${app.student?.name}`);
            console.log(`  Student ID: ${app.student?._id}`);
            console.log(`  Academic Dept: "${app.student?.academicDetails?.department}"`);
            console.log(`  Meta Dept: "${app.student?.studentMeta?.department}"`);
        });

        // 2. Check current supervisor (based on the user name from screenshot if possible, or just list all)
        const supervisors = await User.find({ role: 'supervisor' });
        console.log(`\nTotal Supervisors found: ${supervisors.length}`);
        supervisors.forEach(s => {
            console.log(`  Name: ${s.name} | Dept: "${s.supervisorMeta?.department}" | ID: ${s._id}`);
        });

        console.log('\n--- END DIAGNOSTICS ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

diag();
