const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return cb(null, null, token)
    } catch (err) {
      cb(err)
    }
  },
  signUp: async (req, cb) => {
    try {
      // incorrect confirm password
      if (req.body.password !== req.body.passwordCheck) return cb(null, { code: 400, message: 'password do not match' }, null)
      // missing email or password
      if (!req.body.email || !req.body.password) return cb(null, { code: 400, message: 'email and password are required' }, null)
      const hash = await bcrypt.hash(req.body.password, 10)
      const [user, created] = await User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          name: req.body.name,
          email: req.body.email,
          password: hash
        }
      })
      if (!created) return cb(null, { code: 400, message: 'email already exists' }, null)
      return cb(null, null, user.toJSON())
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
