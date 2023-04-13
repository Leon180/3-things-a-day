// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')

const { pages, apis } = require('./routes')

const app = express();
const port = process.env.PORT || 3000;

app.engine('hbs', handlebars({
  extname: '.hbs',
  partialsDir: ['views/partials']
}));
app.set('view engine', 'hbs')
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use('/api', apis)
app.use(pages)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app