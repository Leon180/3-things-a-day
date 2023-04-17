'use strict';
const { faker } = require('@faker-js/faker');
const dayjs = require('dayjs')

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
      'SELECT id, userId, year, month, day  FROM Dates;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // Create card array
    const fields = dates.map(date => {
      const userId = date.id
      const day = dayjs(date)
      return Array.from({ length: 3 }, (v, i) => {
        const stamp1 = new Date(date.year, date.month - 1, date.day, 17 + (i * 2), 0)
        const stamp2 = new Date(date.year, date.month - 1, date.day, 19 + (i * 2), 0)
        let [start, end] = faker.date.betweens(stamp1, stamp2, 2)
        // if the duration of the card is less than range, extend the end time
        if ((end - start) < range) {
          start = (end - range) < stamp1 ? dayjs(start) : dayjs((end - range))
          end = (end - start) < range ? dayjs(start + range) : dayjs(end)
        }
        return {
          userId,
          dateId: date.id,
          title: faker.lorem.word({ length: { min: 3, max: 12 } }),
          type: faker.helpers.arrayElement(['sport', 'book', 'relax']),
          start: `${dayjs(start).hour()}:${dayjs(start).minute()}`,
          end: `${dayjs(end).hour()}:${dayjs(end).minute()}`,
          record: faker.lorem.paragraph(2),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }).flat(2)
    await queryInterface.bulkInsert('Cards', fields, {})
    console.log('generating cards data done!')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cards', null, {});
  }
};
