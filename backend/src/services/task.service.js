const {
  Task,
  Project,
  TaskAssignment,
  User,
  UserProfile,
} = require("../models");
const { AppError } = require("../utils/AppError");

/* ================= LIST ================= */
exports.getList = async (user) => {
  if (!user?.id) {
    throw new AppError("Invalid user", 400);
  }

  const include = [
    {
      model: Project,
      attributes: ["id", "code", "name"],
    },
    {
      model: TaskAssignment,
      as: "assignments",
      required: false,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
          include: [
            {
              model: UserProfile,
              as: "profile",
              attributes: ["full_name", "avatar"],
            },
          ],
        },
      ],
    },
  ];

  const where = {};

  // ===== RBAC LOGIC =====
  if (user.role === "employee") {
    include[1].where = { user_id: user.id };
    include[1].required = true;
  }

  if (user.role === "manager") {
    include[0].where = { manager_id: user.id };
    include[0].required = true;
  }

  const tasks = await Task.findAll({
    where,
    include,
    order: [["created_at", "DESC"]],
  });

  // ===== FLATTEN DATA =====
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,

    project: task.Project,

    assigned_users:
      task.assignments?.map((a) => ({
        id: a.user?.id,
        name: a.user?.profile?.full_name || a.user?.username,
        avatar: a.user?.profile?.avatar,
      })) || [],
  }));
};

/* ================= CREATE ================= */
exports.create = async (data, io) => {
  if (!data?.project_id) throw new AppError("Project required", 400);

  const project = await Project.findByPk(data.project_id);
  if (!project) throw new AppError("Project not found", 404);

  const existed = await Task.findOne({
    where: {
      project_id: data.project_id,
      title: data.title,
    },
  });

  if (existed) throw new AppError("Task exists", 400);

  const task = await Task.create(data);

  io?.emit("task_created", task);

  return task;
};

/* ================= UPDATE ================= */
exports.update = async (id, data, io) => {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError("Task not found", 404);

  await task.update(data);

  io?.emit("task_updated", task);

  return task;
};

/* ================= DELETE ================= */
exports.remove = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError("Task not found", 404);

  await task.destroy();
};