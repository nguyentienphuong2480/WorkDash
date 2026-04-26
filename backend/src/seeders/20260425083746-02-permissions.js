'use strict';

const resources = ['user', 'project', 'task', 'attendance', 'contract', 'news'];
const actions = ['create', 'read', 'update', 'delete'];

module.exports = {
  async up(queryInterface) {
    let id = 1;
    const data = [];

    for (const r of resources) {
      for (const a of actions) {
        data.push({
          id: id++,
          name: `${r}.${a}`,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('permissions', data);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};