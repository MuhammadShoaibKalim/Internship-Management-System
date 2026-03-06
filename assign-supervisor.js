import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/user.model.js';

dotenv.config();

const assignSupervisorToStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected.');

        // 1. Find a supervisor
        const supervisor = await User.findOne({ role: 'supervisor' });
        if (!supervisor) {
            console.log('No supervisor found in the database. Please create one first.');
            process.exit(1);
        }

        // 2. Find a student
        const student = await User.findOne({ role: 'student' });
        if (!student) {
            console.log('No student found in the database. Please create one first.');
            process.exit(1);
        }

        // 3. Assign supervisor to student
        student.studentMeta = student.studentMeta || {};
        student.studentMeta.supervisor = supervisor._id;
        await student.save();

        console.log(`\n✅ Success! Assigned Supervisor (${supervisor.name} - ${supervisor.email}) to Student (${student.name} - ${student.email})`);
        console.log(`\nIf you applied as this student, go check the Supervisor's Endorsements tab now!`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit(0);
    }
};

assignSupervisorToStudent();

