const service = require("../services/attendance.service");

exports.checkIn = async (req, res) => {
  try {
    const data = await service.checkIn(req.user.id);

    /* ===== SOCKET EMIT (SAFE) ===== */
    const io = req.app.get("io");
    if (io) {
      io.emit("attendance:update", {
        type: "check_in",
        user_id: req.user.id,
        attendance: data
      });
    }

    return res.json({ data, message: "Check-in successful" });
  } catch (err) {
    return res.status(400).json({
      message: err.message || "Check-in failed"
    });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const data = await service.checkOut(req.user.id);

    /* ===== SOCKET EMIT (SAFE) ===== */
    const io = req.app.get("io");
    if (io) {
      io.emit("attendance:update", {
        type: "check_out",
        user_id: req.user.id,
        attendance: data
      });
    }

    return res.json({ data, message: "Check-out successful" });
  } catch (err) {
    return res.status(400).json({
      message: err.message || "Check-out failed"
    });
  }
};


exports.history = async (req, res) => {
  const data = await service.history(req.params.userId);
  res.json({ data });
};

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.user, req.query);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getToday = async (req, res) => {
  const data = await service.getToday(req.user);
  res.json({ data });
};