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

/* ===== MIDDLEWARE ===== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app" // 👈 thêm domain FE
    ],
    credentials: true
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== ROUTES ===== */
app.use("/api", routes);

/* ===== HEALTH ===== */
app.get("/", (req, res) => {
  res.json({ message: "WorkDash API running 🚀" });
});

/* ===== SERVER ===== */
const server = http.createServer(app);

/* ===== SOCKET ===== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// ✅ QUAN TRỌNG: dùng 1 biến global duy nhất
global._io = io;

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

/* ===== ERROR ===== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Server error"
  });
});

/* ===== START ===== */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();