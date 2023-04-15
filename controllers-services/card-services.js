const models = require('../models')
const types = ['sport', 'book', 'relax']
const textlimit = { 'title': 20, 'record': 200 }
const timeReg = /(2[0-3]|1\d|0\d):([1-5]\d|0\d):00/
const helpers = require('../helpers/auth-helpers')

const cardServices = {
  // find a card by id
  // card {} include date {'id', 'year', 'month', 'day'} and user {'id', 'name', 'email'}
  get: async (req, cb) => {
    try {
      const card = await models.Card.findByPk(req.params.id, {
        include: [
          {
            model: models.Date,
            attributes: ['id', 'year', 'month', 'day'],
          },
          {
            model: models.User,
            attributes: ['id', 'name', 'email']
          }
        ],
        raw: true,
        nest: true
      })
      if (!card) return cb(null, {
        code: 400,
        message: "incorrect card id, card doesn't exist"
      })
      return cb(null, null, {
        status: "200",
        message: "card found",
        data: card
      })
    } catch (err) {
      cb(err)
    }
  },
  // find a card by id
  // card {} include date {'id', 'year', 'month', 'day'} and user {'id', 'name', 'email'}
  getByFilter: async (req, cb) => {
    try {
      const card = await models.Card.findByPk(req.params.id, {
        include: [
          {
            model: models.Date,
            attributes: ['id', 'year', 'month', 'day'],
          },
          {
            model: models.User,
            attributes: ['id', 'name', 'email']
          }
        ],
        raw: true,
        nest: true
      })
      if (!card) return cb(null, {
        code: 400,
        message: "incorrect card id, card doesn't exist"
      })
      return cb(null, null, {
        status: "200",
        message: "card found",
        data: card
      })
    } catch (err) {
      cb(err)
    }
  },
  // create a card
  // if already submit 3 cards today, return error
  // will also create the Date
  post: async (req, cb) => {
    try {
      const status = checkCardInput(req)
      if (status) return cb(null, status, null)
      const userId = helpers.getUser(req).id
      const today = new Date()
      const count = await models.Date.count({
        where: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
      })
      if (count >= 3) return cb(null, {
        code: 400,
        message: "you can only submit 3 cards per day"
      })
      const date = await models.Date.create({
        userId,
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      })
      if (!date) cb(null, {
        code: 500,
        message: "date create failed"
      }, null)
      const create = await models.Card.create({
        ...req.body,
        userId,
        dateId: date.id
      })
      if (!create) cb(null, {
        code: 500,
        message: "card create failed"
      }, null)
      return cb(null, null, {
        status: "200",
        message: "create successfully!",
        data: create
      })
    } catch (err) {
      cb(err)
    }
  },
  // update a card
  // if the card is not created by the user, return error
  // if the card is not created today, return error
  put: async (req, cb) => {
    try {
      const status = checkCardInput(req)
      if (status) return cb(null, status, null)
      if (!req.params.id) return cb(null, {
        code: 400,
        message: "incorrect data format: id is required"
      }, null)
      const cardId = req.params.id
      const card = await models.Card.findByPk(cardId)
      if (!card) return cb(null, {
        message: "incorrect card id, card doesn't exist"
      }, null)
      const check = Number(helpers.getUser(req).id) === Number(card.userId) ? true : false
      if (!check) return cb(null, {
        code: 400,
        message: 'permission denied: you can only update your own card'
      }, null)
      if (card.createdAt.getDate() !== new Date().getDate()) return cb(null, {
        code: 400,
        message: "card can only be updated on the same day"
      }, null)
      const cardUpdate = await card.update({
        ...req.body
      })
      if (!cardUpdate) return cb(null, {
        code: 500,
        message: "update failed"
      }, null)
      return cb(null, null, {
        status: "200",
        message: "update successfully",
        data: cardUpdate
      })
    } catch (err) {
      cb(err)
    }
  }
}


// For checking the input data
function checkCardInput(req) {
  const status = {
    code: 400,
    message: ""
  }
  if (!req.body) return {
    ...status,
    message: "data is require"
  }
  const { title, type, start, end, record } = req.body
  if (!title || !type || !start || !end) return {
    ...status,
    message: "incorrect data format: title, type, start, end are required"
  }
  if (title.length > textlimit.title) return {
    ...status,
    message: `title length limit is ${textlimit.title} characters`
  }
  if (!types.includes(type)) return {
    ...status,
    message: "type must be work, study or life"
  }
  if (!timeReg.test(start) || !timeReg.test(end)) return {
    ...status,
    message: "incorrect data format: start and end must be in HH:mm:ss format"
  }
  if (start >= end) return {
    ...status,
    message: "incorrect data format: start must be earlier than end"
  }
  if (record !== null && record.length > textlimit.record) return {
    ...status,
    message: `reocrd length limit is ${textlimit.record} characters`
  }
  return null
}

module.exports = cardServices
