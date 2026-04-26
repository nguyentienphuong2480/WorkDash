const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: "Role",
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!user) throw new Error();

    req.user = {
      id: user.id,
      role: user.Role?.name,
      permissions: user.Role?.permissions?.map((p) => p.name) || [],
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};