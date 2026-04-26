'use strict';

module.exports = {
  async up(queryInterface) {
    const data = [];

    // admin full quyền
    for (let i = 1; i <= 24; i++) {
      data.push({ role_id: 1, permission_id: i, created_at: new Date() });
    }

    // manager
    for (let i = 1; i <= 24; i++) {
      if (i !== 4) {
        data.push({ role_id: 2, permission_id: i, created_at: new Date() });
      }
    }

    // employee (read)
    [2, 6, 10, 14].forEach(id => {
      data.push({ role_id: 3, permission_id: id, created_at: new Date() });
    });

    await queryInterface.bulkInsert('role_permissions', data);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};