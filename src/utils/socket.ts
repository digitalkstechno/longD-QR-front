import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket?.connected) return socket;
  
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3655';
  const socketPath = process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/socket.io';
  
  socket = io(socketUrl, {
    path: socketPath,
    transports: ['polling', 'websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
