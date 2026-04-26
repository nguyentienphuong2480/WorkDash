'use strict';

module.exports = {
  async up(queryInterface) {
    const data = [];

    for (let i = 1; i <= 10; i++) {
      data.push({
        user_id: i,
        token: `token_${i}`,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ✅ +7 ngày
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('refresh_tokens', data);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('refresh_tokens', null, {});
  }
};