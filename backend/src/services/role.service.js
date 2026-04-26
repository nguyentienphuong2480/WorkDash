const { Role } = require("../models");

exports.create = (data) => Role.create(data);
exports.findAll = () => Role.findAll();
exports.update = (id, data) => Role.update(data, { where: { id } });
exports.remove = (id) => Role.destroy({ where: { id } });
