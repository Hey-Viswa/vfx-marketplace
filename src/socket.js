import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from './config/db';
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

      try {
        const savedMessage = await prisma.message.create({
          data: {
            senderId: parseInt(senderId),
            receiverId: parseInt(receiverId),
            content: content,
          },
        });
        io.to(`user_${receiverId}`).emit('receiveMessage', {
          id: savedMessage.id, // <-- [NEW] Added DB ID
          senderId,
          content,
          timestamp: new Date(),
        });

        console.log(`Live Message Saved & Sent:
  ${senderId} -> ${receiverId}`);
      } catch (error) {
        console.error("Failed to save message to DB:", error);
      }
    });
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.userId} disconnected!`);
    });
  });
  return io;
};
