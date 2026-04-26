'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 0; i < 20; i++) {
      const start = faker.date.past();
      const end = faker.date.future();

      data.push({
        user_id: faker.number.int({ min: 1, max: 50 }),
        contract_type: faker.helpers.arrayElement(['fulltime', 'parttime', 'intern']),
        start_date: start,
        end_date: end,
        salary: faker.number.int({ min: 500, max: 3000 }),
        status: faker.helpers.arrayElement(['active', 'expired']),
        file_url: faker.internet.url(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('contracts', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('contracts', null, {});
  }
};