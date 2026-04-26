const db = require("../models");
const { Project, User, UserProfile } = db;
const { Op } = require("sequelize");
const { AppError } = require("../utils/AppError");

/* ================= LIST ================= */
exports.getList = async (user) => {
  if (!user?.id) {
    throw new AppError("Invalid user", 400);
  }

  const where = {};
  const include = [
    {
      model: User,
      as: "manager",
      attributes: ["id", "username"],
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: ["full_name", "avatar"],
        },
      ],
    },
    {
      model: User,
      as: "members",
      attributes: ["id", "username"],
      through: { attributes: [] },
      required: false,
    },
  ];

  // ===== RBAC =====

  // 👇 EMPLOYEE: chỉ project tham gia
  if (user.role === "employee") {
    include[1].where = { id: user.id };
    include[1].required = true;
  }

  // 👇 MANAGER: chỉ project mình quản lý
  if (user.role === "manager") {
    where.manager_id = user.id;
  }

  return Project.findAll({
    where,
    include,
    order: [["created_at", "DESC"]],
  });
};

/* ================= CREATE ================= */
exports.create = async (data) => {
  if (!data) throw new AppError("Invalid data", 400);

  const { member_ids = [], ...projectData } = data;

  const project = await Project.create({
    ...projectData,
    status: data.status || "planning",
  });

  if (member_ids.length) {
    const members = await User.findAll({
      where: { id: member_ids },
    });
    await project.setMembers(members);
  }

  return project;
};

/* ================= UPDATE ================= */
exports.update = async (id, data) => {
  if (!id) throw new AppError("Project ID required", 400);

  const project = await Project.findByPk(id);
  if (!project) throw new AppError("Project not found", 404);

  const { member_ids, ...projectData } = data;

  await project.update(projectData);

  if (Array.isArray(member_ids)) {
    const members = await User.findAll({
      where: { id: member_ids },
    });
    await project.setMembers(members);
  }

  return project;
};

/* ================= DELETE ================= */
exports.softDelete = async (id) => {
  const project = await Project.findByPk(id);
  if (!project) throw new AppError("Project not found", 404);

  await project.destroy();
  return true;
};

/* ================= RECYCLE BIN ================= */
exports.getRecycleBin = async () => {
  return Project.findAll({
    paranoid: false,
    where: {
      deleted_at: { [Op.not]: null },
    },
    order: [["deleted_at", "DESC"]],
  });
};

/* ================= RESTORE ================= */
exports.restore = async (id) => {
  const project = await Project.findByPk(id, { paranoid: false });
  if (!project) throw new AppError("Project not found", 404);

  await project.restore();
  return true;
};

/* ================= FORCE DELETE ================= */
exports.forceDelete = async (id) => {
  await Project.destroy({
    where: { id },
    force: true,
  });
};

/* ================= UPDATE MANAGER ================= */
exports.updateManager = async (id, managerId) => {
  const project = await Project.findByPk(id);
  if (!project) throw new AppError("Project not found", 404);

  await project.update({ manager_id: managerId || null });

  return project;
};