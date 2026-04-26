const { UserProfile } = require("../models");

exports.create = (data) => UserProfile.create(data);
exports.findByUser = (user_id) =>
  UserProfile.findOne({ where: { user_id } });
exports.update = (user_id, data) =>
  UserProfile.update(data, { where: { user_id } });
