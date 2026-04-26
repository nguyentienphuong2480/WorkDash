const { Op } = require("sequelize");
const { sequelize, User, Role, UserProfile } = require("../models");
const bcrypt = require("bcrypt");
const { AppError } = require("../utils/AppError");

/* ================= HELPER ================= */
const buildUserResponse = (user) => {
  if (!user) return null;

  const data = user.toJSON();
  delete data.password;
  return data;
};

/* ================= CREATE ================= */
exports.create = async (data) => {
  if (!data) throw new AppError("Invalid data", 400);

  const {
    username,
    email,
    password,
    role_id,
    full_name,
    phone,
    address,
  } = data;

  if (!username || !password || !role_id) {
    throw new AppError("Missing required fields", 400);
  }

  return sequelize.transaction(async (t) => {
    // check username
    const existed = await User.findOne({ where: { username }, transaction: t });
    if (existed) throw new AppError("Username already exists", 400);

    // check role
    const role = await Role.findByPk(role_id, { transaction: t });
    if (!role) throw new AppError("Role not found", 404);

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create(
      {
        username,
        email,
        password: hashedPassword,
        role_id,
        is_active: true,
      },
      { transaction: t }
    );

    // create profile
    await UserProfile.create(
      {
        user_id: user.id,
        full_name,
        phone,
        address,
      },
      { transaction: t }
    );

    const result = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, as: "Role", attributes: ["id", "name"] },
        { model: UserProfile, as: "profile" },
      ],
      transaction: t,
    });

    return result;
  });
};

/* ================= GET LIST ================= */
exports.getUsers = async () => {
  return User.findAll({
    where: { deleted_at: null },
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "Role", attributes: ["id", "name"] },
      { model: UserProfile, as: "profile" },
    ],
    order: [["created_at", "DESC"]],
  });
};

/* ================= GET ONE ================= */
exports.findById = async (id) => {
  if (!id) throw new AppError("User ID is required", 400);

  const user = await User.findOne({
    where: { id, deleted_at: null },
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "Role", attributes: ["id", "name"] },
      { model: UserProfile, as: "profile" },
    ],
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
};

/* ================= UPDATE ================= */
exports.update = async (id, data) => {
  if (!id) throw new AppError("User ID is required", 400);

  return sequelize.transaction(async (t) => {
    const user = await User.findByPk(id, {
      include: [{ model: UserProfile, as: "profile" }],
      transaction: t,
    });

    if (!user || user.deleted_at) {
      throw new AppError("User not found", 404);
    }

    const { username, email, password, role_id, ...profileData } = data || {};

    const userData = {};

    if (username) userData.username = username;
    if (email) userData.email = email;
    if (role_id) userData.role_id = role_id;

    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }

    // update user
    await user.update(userData, { transaction: t });

    // update profile
    if (user.profile) {
      await user.profile.update(profileData, { transaction: t });
    } else {
      await UserProfile.create(
        { user_id: user.id, ...profileData },
        { transaction: t }
      );
    }

    return exports.findById(id);
  });
};

/* ================= UPDATE STATUS ================= */
exports.updateStatus = async (id, is_active) => {
  if (!id) throw new AppError("User ID is required", 400);

  const user = await User.findByPk(id);

  if (!user || user.deleted_at) {
    throw new AppError("User not found", 404);
  }

  await user.update({ is_active });
  return buildUserResponse(user);
};

/* ================= SOFT DELETE ================= */
exports.softDelete = async (id) => {
  if (!id) throw new AppError("User ID is required", 400);

  const user = await User.findByPk(id, {
    include: [{ model: Role, as: "Role" }],
  });

  if (!user) throw new AppError("User not found", 404);

  if (user.Role?.name === "admin") {
    throw new AppError("Cannot delete admin user", 400);
  }

  await user.update({ is_active: false });
  await user.destroy();

  return true;
};

/* ================= RECYCLE BIN ================= */
exports.getRecycleBin = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    where: {
      deleted_at: { [Op.not]: null },
    },
    paranoid: false,
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "Role" },
      { model: UserProfile, as: "profile" },
    ],
    order: [["deleted_at", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
    },
  };
};

/* ================= RESTORE ================= */
exports.restore = async (id) => {
  if (!id) throw new AppError("User ID is required", 400);

  const user = await User.findByPk(id, { paranoid: false });

  if (!user || !user.deleted_at) {
    throw new AppError("User not found in recycle bin", 404);
  }

  await user.restore();
  await user.update({ is_active: true });

  return true;
};

/* ================= FORCE DELETE ================= */
exports.forceDelete = async (id) => {
  if (!id) throw new AppError("User ID is required", 400);

  return sequelize.transaction(async (t) => {
    await UserProfile.destroy({
      where: { user_id: id },
      force: true,
      transaction: t,
    });

    await User.destroy({
      where: { id },
      force: true,
      transaction: t,
    });

    return true;
  });
};