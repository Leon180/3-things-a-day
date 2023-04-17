const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 30 days token
      return cb(null, null, token)
    } catch (err) {
      cb(err)
    }
  },
  signUp: async (req, cb) => {
    try {
      // missing email or password
      if (!req.body.email || !req.body.password) return cb(null, { status: 400, message: 'email and password are required' }, null)
      // incorrect confirm password
      if (req.body.password !== req.body.passwordCheck) return cb(null, { status: 400, message: 'password, password confirm do not match' }, null)
      const hash = await bcrypt.hash(req.body.password, 10)
      const [user, created] = await User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          name: req.body.name,
          email: req.body.email,
          password: hash
        }
      })
      if (!created) return cb(null, { status: 400, message: 'email already exists' }, null)
      const userJson = user.toJSON()
      delete userJson.password
      return cb(null, null, userJson)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
