// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const methodOverride = require('method-override')
const { setReqUser } = require('./middleware/auth')
const { getUser } = require('./helpers/auth-helpers')
const { apis, pages } = require('./routes')

const app = express();
const port = process.env.PORT || 3000;

Handlebars.registerHelper('raw', function (options) {
  return options.fn();
});

app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
}))
app.set('view engine', 'hbs')
app.set('views', './views');
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(methodOverride('_method'))
app.use(setReqUser)
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})

app.use(apis)
app.use(pages)

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app