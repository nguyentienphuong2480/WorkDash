const router = require("express").Router();
const ctrl = require("../controllers/dashboard.controller");

router.get('/stats', ctrl.getStats);
router.get('/attendance-chart', ctrl.getAttendanceChart);
router.get('/salary-chart', ctrl.getSalaryChart);

module.exports = router;

