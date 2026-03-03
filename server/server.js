import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';


connectDB();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server listening on port: ${PORT} `);
});