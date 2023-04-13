'use strict';

const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('start generating user seed data...')
    // Create Regular users' array
    const fields = await Promise.all(Array.from({ length: 5 }, async (v, i) => ({
      name: faker.internet.userName(),
      email: `user${i + 1}@example.com`,
      password: await bcrypt.hash('12345678', 10),
      createdAt: new Date(),
      updatedAt: new Date()
    })))
    await queryInterface.bulkInsert('Users', fields, {})
    console.log('generating users data done!!')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
