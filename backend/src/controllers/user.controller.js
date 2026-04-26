const userService = require("../services/user.service");
const { success, successMessage } = require("../utils/response");

/* CREATE */
exports.create = async (req, res) => {
  try {
    const data = await userService.create(req.body);
    success(res, data, { status: 201, message: "Created" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

/* LIST */
exports.getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers(req.query);
    res.json({ data: Array.isArray(data) ? data : data ?? [] });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/* GET ONE */
exports.getOne = async (req, res) => {
  try {
    const data = await userService.findById(req.params.id);
    res.json({ data });
  } catch (err) {
    res.status(err.statusCode || 404).json({ message: err.message });
  }
};

/* UPDATE */
exports.update = async (req, res) => {
  try {
    const data = await userService.update(req.params.id, req.body);
    success(res, data, { message: "Updated" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

/* STATUS */
exports.updateStatus = async (req, res) => {
  try {
    const data = await userService.updateStatus(req.params.id, req.body.is_active);
    success(res, data, { message: "Status updated" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

/* SOFT DELETE */
exports.remove = async (req, res) => {
  try {
    await userService.softDelete(req.params.id);
    successMessage(res, "Deleted");
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

/* RECYCLE BIN */
exports.getRecycleBin = async (req, res) => {
  try {
    const result = await userService.getRecycleBin(req.query);
    const data = result?.data ?? result;
    const pagination = result?.pagination;
    if (pagination) res.json({ data, pagination });
    else res.json({ data: data ?? [] });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/* RESTORE */
exports.restore = async (req, res) => {
  try {
    await userService.restore(req.params.id);
    successMessage(res, "Restored");
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

/* FORCE DELETE */
exports.forceDelete = async (req, res) => {
  try {
    await userService.forceDelete(req.params.id);
    successMessage(res, "Deleted permanently");
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};
