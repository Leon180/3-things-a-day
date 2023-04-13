'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('start generating card seed data...')
    // get an array which store { id: userId }
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // Create card array
    const fields = usersId.map(user => {
      return Array.from({ length: 7 }, (v, i) => {
        // generate datas in past 7 days
        const date = new Date(new Date().setHours(23, 59, 59, 999) - i * 86400000)
        return {
          userId: user.id,
          title: '',
          type: '',
          start: '',
          end: '',
          record: '',
          createdAt: date,
          updatedAt: date
        }
      }).map(data => {
        // generate 3 cards in each day, which has different start and end time
        return Array.from({ length: 3 }, (v, i) => {
          const date = new Date(data.createdAt)
          const stamp1 = new Date(date.setHours(18 + (i * 2), 0, 0, 0))
          const stamp2 = new Date(date.setHours(20 + (i * 2), 0, 0, 0))
          let [start, end] = faker.date.betweens(stamp1, stamp2, 2)
          // if the duration of the card is less than 15 minutes, extend the end time
          const range = 15 * 60000
          if ((end - start) < range) {
            start = (end - range) < stamp1 ? stamp1 : new Date((end - range))
            end = (end - start) < range ? new Date(start + range) : end
          }
          return {
            ...data,
            title: faker.lorem.word({ length: { min: 3, max: 12 } }),
            type: faker.helpers.arrayElement(['sport', 'book', 'relax']),
            start: `${start.getHours()}:${start.getMinutes()}`,
            end: `${end.getHours()}:${end.getMinutes()}`,
            record: faker.lorem.paragraph(2)
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
