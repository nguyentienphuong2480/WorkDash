const service = require("../services/projectMember.service");

exports.add = async (req, res) => {
  const { id } = req.params;
  const { user_id, user_ids } = req.body;
  if (user_ids && Array.isArray(user_ids)) {
    await service.addMany(id, user_ids);
    res.json({ message: "Members added" });
  } else if (user_id) {
    await service.add(id, user_id);
    res.json({ message: "Member added" });
  } else {
    res.status(400).json({ message: "user_id or user_ids required" });
  }
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id, req.params.userId);
  res.json({ message: "Member removed" });
};

exports.list = async (req, res) => {
  const data = await service.list(req.params.id);
  res.json({ data });
};
