'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'admin' },
      { id: 2, name: 'manager' },
      { id: 3, name: 'employee' },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};