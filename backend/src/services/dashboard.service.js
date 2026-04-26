const { User, Project, Task, Attendance, Contract, sequelize } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

exports.getOverviewStats = async () => {
  const [totalUsers, activeProjects, overdueTasks] = await Promise.all([
    User.count({ where: { is_active: true } }),
    Project.count({ where: { status: 'active' } }),
    Task.count({
      where: {
        end_date: { [Op.lt]: new Date() }, // nhỏ hơn ngày hiện tại
        status: { [Op.ne]: 'completed' }   // khác trạng thái hoàn thành
      }
    })
  ]);

  return { totalUsers, activeProjects, overdueTasks };
};

exports.getAttendanceData = async () => {
  const data = await Attendance.findAll({
    attributes: [
      ['status', 'name'],
      [fn('COUNT', col('id')), 'value']
    ],
    where: literal(`date = CURRENT_DATE`), // Lấy dữ liệu ngày hôm nay
    group: ['status']
  });

  // Map lại tên hiển thị tiếng Việt
  const statusMap = { 'present': 'Đúng giờ', 'late': 'Đi muộn', 'absent': 'Vắng mặt' };
  
  return data.map(item => ({
    name: statusMap[item.get('name')?.toLowerCase()] || item.get('name'),
    value: parseInt(item.get('value'))
  }));
};

exports.getSalaryData = async () => {
  const currentYear = new Date().getFullYear();

  const data = await Contract.findAll({
    attributes: [
      [fn('EXTRACT', literal('MONTH FROM start_date')), 'month_num'],
      [fn('SUM', col('salary')), 'total_salary']
    ],
    where: {
      status: 'active',
      [Op.and]: [
        literal(`EXTRACT(YEAR FROM start_date) = ${currentYear}`)
      ]
    },
    group: [literal('EXTRACT(MONTH FROM start_date)')],
    order: [[literal('month_num'), 'ASC']]
  });

  return data.map(item => ({
    month: `Tháng ${item.get('month_num')}`,
    totalSalary: parseFloat(item.get('total_salary'))
  }));
};