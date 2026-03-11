import mongoose from 'mongoose';
import dns from 'dns';

try {
    // Increase DNS lookup timeout for SRV records
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    console.log("✅ Custom DNS servers set for robust resolution");
} catch (e) {
    console.log("Skipping DNS setting: " + e.message);
}

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI_STANDARD || process.env.MONGO_URI;

        if (process.env.MONGO_URI_STANDARD) {
            console.log("✅ Connected to mongodb successfully..")
            // console.log('🔌 Connecting using Standard URI (Hotspot Fix)...');
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 60000, // 60 seconds
            socketTimeoutMS: 60000,
            connectTimeoutMS: 60000
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