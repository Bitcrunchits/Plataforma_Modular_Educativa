// src/providers/socket.provider.js
let ioInstance = null;

export function setSocketInstance(io) {
  ioInstance = io;
}

export function getSocketInstance() {
  return ioInstance;
}
