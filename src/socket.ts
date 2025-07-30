// src/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // adjust when you create backend

export default socket;
