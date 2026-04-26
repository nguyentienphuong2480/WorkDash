const service = require("../services/profile.service");

exports.create = async (req, res) => {
  res.json(await service.create(req.body));
};

exports.getByUser = async (req, res) => {
  res.json(await service.findByUser(req.params.userId));
};

exports.update = async (req, res) => {
  await service.update(req.params.userId, req.body);
  res.json({ message: "Updated" });
};
