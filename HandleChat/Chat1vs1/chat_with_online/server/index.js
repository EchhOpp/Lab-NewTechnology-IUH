const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());

const users = {}; // Store connected users

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('setUsername', (username) => {
        users[socket.id] = username;
        socket.username = username;

        io.emit('onlineUsers', Object.values(users));
    });

    socket.on('sendMessage', (message) => {
        const msgData = {
            user: socket.username,
            message: message,
        };
        io.emit('receiveMessage', msgData);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('onlineUsers', Object.values(users));

        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});