'use strict';
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('start generating date seed data...')
    // get an array which store { id: userId }
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // Create date array
    const fields = usersId.map(user => {
      return Array.from({ length: 7 }, (v, i) => {
        // generate 7 days
        const today = dayjs()
        return {
          userId: user.id,
          year: today.year(),
          month: today.month() + 1,
          day: today.date() - i,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
    }).flat()
    await queryInterface.bulkInsert('Dates', fields, {})
    console.log('date data done!')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Dates', null, {});
  }
};
