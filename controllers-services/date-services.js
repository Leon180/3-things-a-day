const models = require('../models')
const helpers = require('../helpers/auth-helpers')
const dayjs = require('dayjs')

const dateServices = {
  get: async (req, cb) => {
    try {
      const user = helpers.getUser(req)
      if (!user) return cb(null, {
        status: 401,
        message: "user not authenticated"
      })
      const userId = user.id || null
      let searchCondition = { userId }
      const { year, month, day } = req.query
      // if no assign day condition, will return today's date
      if (!year && !month && !day) {
        searchCondition = {
          ...searchCondition,
          year: dayjs().year(),
          month: dayjs().month() + 1,
          day: dayjs().date()
        }
      }
      else if (year && month && day) {
        searchCondition = {
          ...searchCondition,
          year,
          month,
          day
        }
      }
      else if (year && month && !day) {
        searchCondition = {
          ...searchCondition,
          year,
          month
        }
      }
      else if (year && !month && !day) {
        searchCondition = {
          ...searchCondition,
          year,
        }
      }
      else return cb(null, {
        status: 400,
        message: "invalid query"
      })
      const date = await models.Date.findAll({
        where: searchCondition,
        include: [{ model: models.Card }],
        order: [
          ['year', 'DESC'],
          ['month', 'DESC'],
          ['day', 'DESC'],
        ],
        raw: true,
        nest: true
      })
      if (!date) return cb(null, {
        status: 400,
        message: "date not found"
      })
      return cb(null, null, date)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = dateServices
