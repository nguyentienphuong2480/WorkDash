'use strict';

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('admin123', 10);

    const users = [];

    // 🔥 ADMIN CỐ ĐỊNH
    users.push({
      id: 1,
      username: 'admin',
      email: 'admin@gmail.com',
      password,
      role_id: 1, // admin role
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    // 👇 Các user khác
    for (let i = 2; i <= 50; i++) {
      users.push({
        id: i,
        username: faker.internet.username(),
        email: faker.internet.email(),
        password,
        role_id: faker.helpers.arrayElement([2, 3]),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};