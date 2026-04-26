const { News, User } = require("../models");
const { AppError } = require("../utils/AppError");

exports.create = async (data, createdBy) => {
  const user = await User.findByPk(createdBy);
  if (!user) throw new AppError("User not found", 404);

  return await News.create({
    ...data,
    created_by: createdBy
  });
};

exports.findAll = () =>
  News.findAll({
    order: [["created_at", "DESC"]]
  });

exports.update = (id, d) => News.update(d, { where: { id } });
exports.remove = (id) => News.destroy({ where: { id } });
