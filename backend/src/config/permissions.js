module.exports = {
  admin: ["*"],

  manager: [
    "project.read",
    "project.create",
    "project.update",
    "project.assign_manager",

    "task.read",
    "task.create",
    "task.update",
    "task.assign",

    "attendance.read",
    "attendance.check",
  ],

  employee: [
    "task.read",
    "attendance.check",
    "attendance.read_own",
    "user.read_own",
  ],
};