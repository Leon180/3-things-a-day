const jwt = require('jsonwebtoken')
const models = require('../models')
const dayjs = require('dayjs')

const setReqUser = async (req, res, next) => {
  try {
    const cookies = req.cookies
    if (!cookies.accessToken) return next()
    const decoded = jwt.verify(cookies.accessToken, process.env.JWT_SECRET)
    if (!decoded) return next()
    const today = dayjs()
    const searchCondition = {
      year: today.year(),
      month: today.month() + 1,
      day: today.date()
    }
    const user = await models.User.findByPk(decoded.id, {
      include: [
        { model: models.Date, where: searchCondition }
      ]
    })
    if (!user) return next()
    req.user = user.toJSON() || user
    next()
  } catch (err) {
    res.status(401).send({ err: err.message })
  }
}

const authenticatedRedirect = async (req, res, next) => {
  try {
    const cookies = req.cookies
    if (!cookies.accessToken) return res.redirect('/signin')
    const decoded = jwt.verify(cookies.accessToken, process.env.JWT_SECRET)
    if (!decoded) return res.redirect('/signin')
    const user = await models.User.findByPk(decoded.id)
    if (!user) return res.redirect('/signin')
    next()
  } catch (err) {
    res.status(401).send({ err: err.message })
  }
}

const authenticatedRedirectHome = async (req, res, next) => {
  try {
    const cookies = req.cookies
    if (!cookies.accessToken) return next()
    const decoded = jwt.verify(cookies.accessToken, process.env.JWT_SECRET)
    if (!decoded) return next()
    const user = await models.User.findByPk(decoded.id)
    if (!user) return next()
    res.redirect('/')
  } catch (err) {
    res.status(401).send({ err: err.message })
  }
}

module.exports = {
  setReqUser,
  authenticatedRedirect,
  authenticatedRedirectHome
}
