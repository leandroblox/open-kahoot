'use client';

import { io, Socket } from 'socket.io-client';
import { SOCKET_PATH } from './socket-config';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types/game';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let initializationPromise: Promise<void> | null = null;

const ensureSocketServer = () => {
  if (!initializationPromise) {
    initializationPromise = fetch(SOCKET_PATH, {
      method: 'GET',
      cache: 'no-store',
    })
      .then(() => undefined)
      .catch(() => {
        // Ignore initialization errors – the socket connection will retry
      });
  }
  return initializationPromise;
};

const connectSocket = () => {
  if (!socket) return;

  if (!socket.connected) {
    socket.connect();
  }
};

export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> => {
  if (!socket) {
    socket = io({
      path: SOCKET_PATH,
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    ensureSocketServer()?.finally(connectSocket);
  } else if (!socket.connected && socket.disconnected) {
    ensureSocketServer()?.finally(connectSocket);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 