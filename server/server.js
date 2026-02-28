import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);


const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a new user connected', socket.id);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('static', express.static('./public'));


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});