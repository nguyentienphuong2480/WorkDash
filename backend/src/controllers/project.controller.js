const service = require("../services/project.service");
const { success, successMessage } = require("../utils/response");

exports.getList = async (req, res, next) => {
  try {
    const data = await service.getList(req.user, req.query);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.user, req.body);
    success(res, data, { status: 201 });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.user, req.params.id, req.body);
    success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.softDelete = async (req, res, next) => {
  try {
    await service.softDelete(req.params.id);
    successMessage(res, "Project moved to recycle bin");
  } catch (err) {
    next(err);
  }
};

exports.getRecycleBin = async (req, res, next) => {
  try {
    const data = await service.getRecycleBin();
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

exports.restore = async (req, res, next) => {
  try {
    await service.restore(req.params.id);
    successMessage(res, "Project restored successfully");
  } catch (err) {
    next(err);
  }
};

exports.forceDelete = async (req, res, next) => {
  try {
    await service.forceDelete(req.params.id);
    successMessage(res, "Project permanently deleted");
  } catch (err) {
    next(err);
  }
};

exports.updateManager = async (req, res, next) => {
  try {
    const data = await service.updateManager(
      req.user,
      req.params.id,
      req.body.manager_id
    );
    success(res, data);
  } catch (err) {
    next(err);
  }
};