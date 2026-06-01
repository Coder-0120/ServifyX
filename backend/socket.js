// backend/socket.js
// Central socket logic — imported by index.js and bookingController.js

let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // your Vite frontend URL
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Client calls this right after connecting, passing their userId
    // so we can join them to a personal room for targeted events
    socket.on("join_room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Providers join a service-type room to receive new booking alerts
    // e.g. "plumbing", "electrical", etc.
    socket.on("join_service_room", (serviceType) => {
      socket.join(`service_${serviceType.toLowerCase()}`);
      console.log(`Provider joined service room: service_${serviceType}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Use this in controllers — always returns the initialized io instance
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };