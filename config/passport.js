const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')
const { User, Card, Date } = require('../models')

// customize signin strategy
const userField = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}
const authenticater = (req, email, password, cb) => {
  User.findOne({ where: { email } })
    .then(user => {
      console.log(user)
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
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}
passport.use('token', new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Card },
      { model: Date }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Card },
        { model: Date }
      ]
    })
    return cb(null, user.toJSON() || user)
  } catch (err) {
    cb(err)
  }
})
module.exports = passport
