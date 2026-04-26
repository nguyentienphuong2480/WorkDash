exports.checkPermission = (options = {}) => {
  const {
    permission,        // string: "task.read"
    roles = [],        // array: ["admin", "manager"]
    allowOwner = false // optional: cho phép user thao tác chính mình
  } = typeof options === "string"
    ? { permission: options }
    : options;

  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ===== ADMIN FULL ACCESS =====
    if (user.role === "admin") {
      return next();
    }

    // ===== ROLE FALLBACK =====
    if (roles.length && roles.includes(user.role)) {
      return next();
    }

    // ===== PERMISSION CHECK =====
    if (permission) {
      const hasPermission = user.permissions?.includes(permission);

      if (hasPermission) {
        return next();
      }
    }

    // ===== OWNER CHECK (OPTIONAL) =====
    if (allowOwner) {
      const targetUserId =
        req.params.userId ||
        req.body.user_id ||
        req.query.user_id;

      if (targetUserId && Number(targetUserId) === user.id) {
        return next();
      }
    }

    // ===== DENY =====
    console.warn("RBAC DENY:", {
      userId: user.id,
      role: user.role,
      requiredPermission: permission,
      allowedRoles: roles,
      userPermissions: user.permissions,
    });

    return res.status(403).json({
      message: "Permission denied",
    });
  };
};