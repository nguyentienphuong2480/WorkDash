const { Contract, User } = require("../models");
const { AppError } = require("../utils/AppError");

exports.getAll = async () => {
  return Contract.findAll({
    include: [{ model: User, attributes: ["id", "username", "email"] }],
    order: [["id", "DESC"]]
  });
};

exports.update = async (id, data) => {
  const contract = await Contract.findByPk(id);
  if (!contract) throw new AppError("Contract not found", 404);
  await contract.update(data);
  return contract;
};

exports.remove = async (id) => {
  const contract = await Contract.findByPk(id);
  if (!contract) throw new AppError("Contract not found", 404);
  await contract.destroy();
};

exports.create = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);

  const existed = await Contract.findOne({ where: { user_id: userId } });
  if (existed) throw new AppError("User already has contract", 400);

  return Contract.create({ ...data, user_id: userId });
};

exports.getByUser = (userId) =>
  Contract.findOne({ where: { user_id: userId } });

exports.terminate = async (id) => {
  const contract = await Contract.findByPk(id);
  if (!contract) throw new AppError("Contract not found", 404);

  contract.status = "terminated";
  await contract.save();
};
