'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 0; i < 200; i++) {
      const checkIn = faker.date.recent();
      const checkOut = new Date(checkIn);
      checkOut.setHours(checkIn.getHours() + 8);

      data.push({
        user_id: faker.number.int({ min: 1, max: 50 }),
        date: checkIn,
        check_in: checkIn,
        check_out: checkOut,
        working_hours: 8,
        status: faker.helpers.arrayElement(['present', 'late', 'absent']),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('attendance', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('attendance', null, {});
  }
};