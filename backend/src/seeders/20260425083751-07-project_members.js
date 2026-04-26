'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 0; i < 50; i++) {
      data.push({
        user_id: faker.number.int({ min: 1, max: 50 }),
        project_id: faker.number.int({ min: 1, max: 20 }),
        role_in_project: 'member',
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('project_members', data);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('project_members', null, {});
  }
};