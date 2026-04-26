'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    // 🔥 ADMIN PROFILE (cố định)
    data.push({
      user_id: 1,
      full_name: 'System Admin',
      phone: '0900000000',
      birthday: '1990-01-01',
      gender: 'male',
      address: 'Ho Chi Minh City',
      position: 'Administrator',
      department: 'IT',
      created_at: new Date(),
      updated_at: new Date()
    });

    // 👇 Các user còn lại
    for (let i = 2; i <= 50; i++) {
      data.push({
        user_id: i,
        full_name: faker.person.fullName(),
        phone: `0${faker.string.numeric(9)}`,
        birthday: faker.date.birthdate({ min: 18, max: 50, mode: 'age' }),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        address: faker.location.streetAddress(),
        position: faker.person.jobTitle(),
        department: faker.commerce.department(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('user_profiles', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_profiles', null, {});
  }
};