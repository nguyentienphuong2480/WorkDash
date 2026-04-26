const service = require("../services/contract.service");

exports.getAll = async (req, res) => {
  const data = await service.getAll();
  res.json({ data });
};

exports.create = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.user_id;
    const data = await service.create(userId, req.body);
    res.status(201).json({ data });
  } catch (e) {
    res.status(e.statusCode || 400).json({ message: e.message });
  }
};

exports.getByUser = async (req, res) => {
  const data = await service.getByUser(req.params.userId);
  res.json({ data });
};

exports.terminate = async (req, res) => {
  await service.terminate(req.params.id);
  res.json({ message: "Contract terminated" });
};

exports.update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ data, message: "Updated" });
  } catch (e) {
    res.status(e.statusCode || 400).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(e.statusCode || 400).json({ message: e.message });
  }
};
