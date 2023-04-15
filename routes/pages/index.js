const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const { generalErrorHandler, apiErrorHandler } = require('../../middleware/error-handler')

const cardController = require('../../controllers/apis/card-controller')
const userAPIController = require('../../controllers/apis/user-controller')
const userController = require('../../controllers/pages/user-controller')

router.get('/signin', (req, res) => res.render('signin'))
router.get('/signup', (req, res) => res.render('signup'))
router.get('/', (req, res) => res.render('index'))
router.use('/', (req, res) => res.redirect('/'))
router.use('/', generalErrorHandler)

module.exports = router
