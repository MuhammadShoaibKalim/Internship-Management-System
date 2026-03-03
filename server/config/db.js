import mongoose from 'mongoose';
import dns from 'dns';

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log("✅ Custom DNS servers set to Google (8.8.8.8)");
} catch (e) {
    console.log("Skipping DNS setting: " + e.message);
}

const connectDB = async () => {
    try {
        //   console.log('🔌 Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected Successfully!`);
        // console.log(`   Host: ${conn.connection.host}`);
        // console.log(`   Database: ${conn.connection.name}`);

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);


        if (error.name === 'MongoServerSelectionError') {
            console.log('⚠️ Possible solutions:');
            console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
            console.log('2. Verify username/password in .env file');
            console.log('3. Ensure MongoDB Atlas cluster is running');
        }

        process.exit(1);
    }
};

export default connectDB;