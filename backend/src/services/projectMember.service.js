const { ProjectMember, User, Project } = require("../models");
const { AppError } = require("../utils/AppError");

exports.add = async (project_id, user_id) => {
  const existed = await ProjectMember.findOne({
    where: { project_id, user_id }
  });
  if (existed) throw new AppError("Already a member", 400);

  return ProjectMember.create({ project_id, user_id });
};

exports.addMany = async (project_id, user_ids) => {
  if (!Array.isArray(user_ids) || user_ids.length === 0) {
    throw new AppError("user_ids must be a non-empty array", 400);
  }
  const existing = await ProjectMember.findAll({
    where: { project_id, user_id: user_ids }
  });
  const existingIds = new Set(existing.map((e) => e.user_id));
  const toAdd = user_ids.filter((id) => !existingIds.has(id));
  if (toAdd.length === 0) {
    throw new AppError("All selected users are already members", 400);
  }
  await ProjectMember.bulkCreate(
    toAdd.map((user_id) => ({ project_id, user_id }))
  );
  return toAdd.length;
};

exports.remove = (project_id, user_id) =>
  ProjectMember.destroy({ where: { project_id, user_id } });

exports.list = async (project_id) => {
  const project = await Project.findByPk(project_id, {
    include: [
      { model: User, as: "Users", attributes: ["id", "username"], through: { attributes: [] } },
    ],
  });
  return project ? project.Users : [];
};
