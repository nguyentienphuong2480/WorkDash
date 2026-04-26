const service = require("../services/taskAssignment.service");

exports.assign = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await service.assignTask(req.params.taskId, user_id);
    res.json({ data });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.unassign = async (req, res) => {
  await service.unassign(req.params.taskId, req.params.userId);
  res.json({ message: "User unassigned from task" });
};

exports.listAssignees = async (req, res) => {
  const data = await service.listAssignees(req.params.taskId);
  res.json({ data });
};

exports.listUserTasks = async (req, res) => {
  const data = await service.listUserTasks(req.params.userId);
  res.json({ data });
};
