// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const { apis } = require('./routes')

const app = express();
const port = process.env.PORT || 3000;

Handlebars.registerHelper('raw', function (options) {
  return options.fn();
});

app.engine('hbs', handlebars({
  extname: '.hbs',
  partialsDir: ['views/partials']
}));
app.set('view engine', 'hbs')
app.use(express.static('public'));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
// for handlebars
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(apis)
// app.use(pages)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app