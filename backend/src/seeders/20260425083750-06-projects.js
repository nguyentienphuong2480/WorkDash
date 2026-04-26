'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 1; i <= 20; i++) {
      data.push({
        id: i,
        code: `PRJ-${i}`,
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['planning', 'active', 'completed']),
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        manager_id: faker.number.int({ min: 2, max: 5 }), // manager
        is_active: true,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('projects', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('projects', null, {});
  }
};