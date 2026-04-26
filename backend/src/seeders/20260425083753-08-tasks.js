'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 1; i <= 100; i++) {
      const start = faker.date.recent();
      const end = faker.date.soon();

      data.push({
        id: i,
        project_id: faker.number.int({ min: 1, max: 20 }),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['todo', 'in_progress', 'done']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        start_date: start,
        end_date: end,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('tasks', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};