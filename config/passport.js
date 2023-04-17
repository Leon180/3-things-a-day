const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')
const models = require('../models')
const dayjs = require('dayjs')

// customize signin strategy
const userField = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}
const authenticater = (req, email, password, cb) => {
  models.User.findOne({ where: { email } })
    .then(user => {
      if (!user) return cb("Incorrect email or password")
      bcrypt.compare(password, user.password).then(res => {
        if (!res) return cb("Incorrect email or password")
        return cb(null, user)
      })
    })
}
passport.use('signin', new LocalStrategy(userField, authenticater))

// set up Passport JWT strategy
const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}
passport.use('token', new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  models.User.findByPk(jwtPayload.id)
    .then(user => {
      cb(null, user)
    })
    .catch(err => cb(err))
}))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  const today = dayjs()
  const searchCondition = {
    year: today.year(),
    month: today.month() + 1,
    day: today.date()
  }
  return models.User.findByPk(id, {
    include: [
      { model: models.Date, where: searchCondition }
    ]
  })
    .then(user => cb(null, user.toJSON() || user))
    .catch(err => {
      cb(err)
    })
})
module.exports = passport
