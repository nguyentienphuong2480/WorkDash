const service = require("../services/task.service");
const taskAssignmentService = require("../services/taskAssignment.service");

exports.getList = async (req, res) => {
  const data = await service.getList(req.user);
  res.json({ data });
};

exports.assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await taskAssignmentService.assignTask(taskId, user_id);

    res.status(201).json({
      message: "Task assigned successfully",
      data: result
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.create = async (req, res) => {
  const data = await service.create(req.body);
  res.status(201).json({ data });
};

exports.getByProject = async (req, res) => {
  const data = await service.findByProject(req.params.projectId);
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