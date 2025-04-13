const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Cho phép mọi nguồn (dev)
  },
});

io.on('connection', (socket) => {
  console.log(`🟢 [${socket.id}] connected`);

  // Lưu tên user
  socket.on('setUsername', (username) => {
    socket.username = username; // lưu tên vào socket
    console.log(`👤 ${socket.id} set name to: ${username}`);
  });

  socket.on('sendMessage', (message) => {
    const msgData = {
      username: socket.username || 'Unknown',
      message: message,
    };
    console.log(`📩 ${msgData.username}: ${msgData.message}`);
    io.emit('receiveMessage', msgData); // gửi lại cho tất cả
  });

  socket.on('disconnect', () => {
    console.log(`🔴 [${socket.id}] disconnected`);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
