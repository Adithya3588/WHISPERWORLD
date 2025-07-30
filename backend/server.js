const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Use your frontend URL in production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`📥 User ${socket.id} joined room: ${room}`);
  });

  socket.on("sendMessage", ({ room, text, time, from }) => {
    console.log(`📤 Message received: ${text} from ${from} in ${room}`);
    io.to(room).emit("receiveMessage", { text, time, from });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Socket server running on port 5000");
});
