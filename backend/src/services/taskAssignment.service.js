const {
  sequelize,
  Task,
  User,
  ProjectMember,
  TaskAssignment,
} = require("../models");
const { AppError } = require("../utils/AppError");

exports.assignTask = async (taskId, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const task = await Task.findByPk(taskId, { transaction });
    if (!task) throw new AppError("Task not found", 404);

    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new AppError("User not found", 404);

    const isMember = await ProjectMember.findOne({
      where: {
        project_id: task.project_id,
        user_id: userId,
      },
      transaction,
    });
    if (!isMember)
      throw new AppError("User is not a member of this project", 400);

    const exists = await TaskAssignment.findOne({
      where: {
        task_id: taskId,
        user_id: userId,
      },
      transaction,
    });
    if (exists) throw new AppError("User already assigned to this task", 400);

    /* ===== 5. Create assignment ===== */
    const assignment = await TaskAssignment.create(
      {
        task_id: taskId,
        user_id: userId,
      },
      { transaction },
    );

    await transaction.commit();
    if (global._io) {
      global._io.emit("task_assigned", {
        taskId,
        user_id,
      });
    }
    return assignment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.unassign = async (task_id, user_id) => {
  const deleted = await TaskAssignment.destroy({
    where: { task_id, user_id },
  });

  if (!deleted) throw new AppError("Assignment not found", 404);
};

exports.listAssignees = async (task_id) => {
  return User.findAll({
    include: {
      model: TaskAssignment,
      where: { task_id },
      attributes: [],
    },
    attributes: ["id", "username", "email"],
  });
};

exports.listUserTasks = async (user_id) => {
  return Task.findAll({
    include: {
      model: TaskAssignment,
      where: { user_id },
      attributes: [],
    },
  });
};
