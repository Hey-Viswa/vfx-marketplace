import app from './app.js';
import http from 'http';
import { initializeSocket } from './socket.js';

// 1. Wrap the Express app in a raw Node HTTP server
const httpServer = http.createServer(app);

initializeSocket(httpServer);
httpServer.listen(3000, () => {
  console.log('Server (with WebSockets) is running on http://localhost:3000');
});
