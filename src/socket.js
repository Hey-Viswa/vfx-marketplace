import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication failed: No token provided'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication Error: Invalid token'));
    }
  });
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.userId} connected to Chat!`);
    socket.join(`user_${socket.user.userId}`);

    socket.on('sendMessage', async (data) => {
      const { receiverId, content } = data;
      const senderId = socket.user.userId;

      io.to(`user_${receiverId}`).emit('receiveMessage', {
        senderId,
        content,
        timestamp: new Date()
      });
      console.log(`Live Message: ${senderId} -> ${receiverId}`);
    });
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.userId} disconnected!`);
    });
  });
  return io;
};
