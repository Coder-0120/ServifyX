// backend/index.js
const express = require("express");
const http = require("http");           // ← NEW
const app = express();
const server = http.createServer(app);  // ← NEW: wrap express in http server

const connectDb = require("../backend/config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const cors = require("cors");
const { initSocket } = require("./socket"); // ← NEW

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
dotenv.config();
connectDb();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/assistant", assistantRoutes);

// Initialize socket AFTER app setup
initSocket(server); // ← NEW

server.listen(5000, () => {
  console.log("Server is running on port 5000");
  console.log("Socket.io attached ✅");
});