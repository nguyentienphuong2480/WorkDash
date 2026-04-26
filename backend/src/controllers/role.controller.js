const service = require("../services/role.service");

exports.create = async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ data });
};

exports.getAll = async (req, res) => {
  const data = await service.findAll();
  res.json({ data });
};

exports.update = async (req, res) => {
  await service.update(req.params.id, req.body);
  res.json({ message: "Updated" });
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id);
  res.json({ message: "Deleted" });
};
