const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { sequelize } = require("./src/models");

dotenv.config();

const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===== CORS CONFIG (PRODUCTION READY) ===== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://work-dash-five.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // cho phép request không có origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

// 🔥 xử lý preflight request
app.options("*", cors());

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== ROUTES ===== */
app.use("/api", routes);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.json({ message: "WorkDash API running 🚀" });
});

/* ===== SERVER ===== */
const server = http.createServer(app);

/* ===== SOCKET.IO ===== */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// global socket (dùng realtime ở service)
global._io = io;

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

/* ===== ERROR HANDLER ===== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // lỗi CORS custom
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Server error"
  });
});

/* ===== START SERVER ===== */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to connect DB:", err);
  }
})();