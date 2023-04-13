'use strict';
const { faker } = require('@faker-js/faker');

const range = 15 * 60000

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('start generating card seed data...')
    // get an length 5 array which store { id: userId }
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // get an length 7 array which store { id: dateId, day, createdAt }
    const dates = await queryInterface.sequelize.query(
      'SELECT id, year, month, day, createdAt  FROM Dates;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // Create card array
    const fields = dates.map(date => {
      return Array.from({ length: 5 }, (v, i) => {
        const userId = users[i].id
        const day = new Date(Date.UTC(date.year, date.month - 1, date.day - i, 23, 0, 0, 0))
        return Array.from({ length: 3 }, (v, i) => {
          const stamp1 = new Date(date.createdAt.setHours(18 + (i * 2), 0, 0, 0))
          const stamp2 = new Date(date.createdAt.setHours(20 + (i * 2), 0, 0, 0))
          let [start, end] = faker.date.betweens(stamp1, stamp2, 2)
          // if the duration of the card is less than range, extend the end time
          if ((end - start) < range) {
            start = (end - range) < stamp1 ? stamp1 : new Date((end - range))
            end = (end - start) < range ? new Date(start + range) : end
          }
          return {
            userId,
            dateId: date.id,
            title: faker.lorem.word({ length: { min: 3, max: 12 } }),
            type: faker.helpers.arrayElement(['sport', 'book', 'relax']),
            start: `${start.getHours()}:${start.getMinutes()}`,
            end: `${end.getHours()}:${end.getMinutes()}`,
            record: faker.lorem.paragraph(2),
            createdAt: day,
            updatedAt: day
          }
        })
      })
    }).flat(2)
    await queryInterface.bulkInsert('Cards', fields, {})
    console.log('generating cards data done!')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cards', null, {});
  }
};
