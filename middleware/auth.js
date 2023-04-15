const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticatedRedirect = async (req, res, next) => {
  try {
    const cookies = req.cookies
    if (!cookies.accessToken) return res.redirect('/signin')
    const decoded = jwt.verify(cookies.accessToken, process.env.JWT_SECRET)
    if (!decoded) return res.redirect('/signin')
    const user = await User.findByPk(decoded.id)
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
    const user = await User.findByPk(decoded.id)
    if (!user) return next()
    res.redirect('/')
  } catch (err) {
    res.status(401).send({ err: err.message })
  }
}

module.exports = {
  authenticatedRedirect,
  authenticatedRedirectHome
}
