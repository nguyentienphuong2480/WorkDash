const { AppError } = require("./AppError");

exports.hasPermission = (user, permission) => {
  if (!user?.permissions) return false;

  // admin full quyền
  if (user.permissions.includes("*")) return true;

  return user.permissions.includes(permission);
};

exports.requirePermission = (user, permission) => {
  if (!exports.hasPermission(user, permission)) {
    throw new AppError("Permission denied", 403);
  }
};