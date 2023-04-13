'use strict';

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
        const today = new Date()
        const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - i, 23, 0, 0, 0))
        return {
          userId: user.id,
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
          createdAt: date,
          updatedAt: date
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
