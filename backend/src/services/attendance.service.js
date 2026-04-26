const { Attendance, User } = require("../models");
const dayjs = require("dayjs");
const { AppError } = require("../utils/AppError");

/* ================= CHECK IN ================= */
exports.checkIn = async (userId) => {
  if (!userId) throw new AppError("Unauthorized", 401);

  const today = dayjs().format("YYYY-MM-DD");

  const existed = await Attendance.findOne({
    where: { user_id: userId, date: today },
  });

  // đã check-in
  if (existed?.check_in) {
    throw new AppError("Already checked in today", 400);
  }

  // chưa có record -> tạo mới
  if (!existed) {
    return Attendance.create({
      user_id: userId,
      date: today,
      check_in: new Date(),
      status: dayjs().hour() > 9 ? "late" : "normal",
    });
  }

  // có record nhưng chưa check-in (edge case)
  await existed.update({
    check_in: new Date(),
    status: dayjs().hour() > 9 ? "late" : "normal",
  });

  return existed;
};

/* ================= CHECK OUT ================= */
exports.checkOut = async (userId) => {
  if (!userId) throw new AppError("Unauthorized", 401);

  const today = dayjs().format("YYYY-MM-DD");

  const record = await Attendance.findOne({
    where: { user_id: userId, date: today },
  });

  if (!record || !record.check_in) {
    throw new AppError("You have not checked in", 400);
  }

  if (record.check_out) {
    throw new AppError("Already checked out", 400);
  }

  const checkOutTime = new Date();

  const workingHours =
    (checkOutTime - record.check_in) / 1000 / 60 / 60;

  await record.update({
    check_out: checkOutTime,
    working_hours: Number(workingHours.toFixed(2)),
  });

  return record;
};

/* ================= HISTORY (BY USER) ================= */
exports.history = async (userId) => {
  if (!userId) throw new AppError("User ID required", 400);

  return Attendance.findAll({
    where: { user_id: userId },
    include: [
      {
        model: User,
        attributes: ["id", "username"],
      },
    ],
    order: [["date", "DESC"]],
  });
};

/* ================= GET ALL ================= */
exports.getAll = async (user, query = {}) => {
  if (!user?.id) {
    throw new AppError("Invalid user", 400);
  }

  const { date } = query;
  const where = {};

  // ✅ RBAC
  if (user.role !== "admin") {
    where.user_id = user.id;
  }

  if (date) {
    where.date = date;
  }

  return Attendance.findAll({
    where,
    include: [
      {
        model: User,
        attributes: ["id", "username"],
      },
    ],
    order: [["date", "DESC"]],
  });
};

/* ================= TODAY ================= */
exports.getToday = async (user) => {
  if (!user?.id) return null;

  const today = dayjs().format("YYYY-MM-DD");

  return Attendance.findOne({
    where: {
      user_id: user.id,
      date: today,
    },
  });
};