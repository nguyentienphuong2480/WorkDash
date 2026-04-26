const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const db = {};

db.Role = require("./role.model")(sequelize, DataTypes);
db.Permission = require("./permission.model")(sequelize, DataTypes);
db.RolePermission = require("./rolePermission.model")(sequelize, DataTypes);
db.User = require("./user.model")(sequelize, DataTypes);
db.UserProfile = require("./user_profile.model")(sequelize, DataTypes);
db.Project = require("./project.model")(sequelize, DataTypes);
db.ProjectMember = require("./projectMember.model")(sequelize, DataTypes);
db.Task = require("./task.model")(sequelize, DataTypes);
db.TaskAssignment = require("./taskAssignment.model")(sequelize, DataTypes);
db.Contract = require("./contract.model")(sequelize, DataTypes);
db.Attendance = require("./attendance.model")(sequelize, DataTypes);
db.News = require("./news.model")(sequelize, DataTypes);
db.RefreshToken = require("./refreshToken.model")(sequelize, DataTypes);

// ASSOCIATE
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;