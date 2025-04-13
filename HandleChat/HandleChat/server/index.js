const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  connectionStateRecovery: {
        // The maximum delay in milliseconds between two connection attempts
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        // Skip the buffering of packets when the connection is lost
        skipMiddlewares: true,
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    // Broadcast the message to all connected clients
    // socket.broadcast.emit('chat message', msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});