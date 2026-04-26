'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 0; i < 10; i++) {
      data.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['draft', 'published']),
        created_by: 1, // admin
        image_url: faker.image.urlPicsumPhotos(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('news', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('news', null, {});
  }
};