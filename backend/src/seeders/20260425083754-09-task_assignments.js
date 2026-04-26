'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 1; i <= 100; i++) {
      data.push({
        user_id: faker.number.int({ min: 1, max: 50 }),
        task_id: i,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('task_assignments', data);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('task_assignments', null, {});
  }
};