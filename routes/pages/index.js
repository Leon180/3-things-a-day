const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticatedRedirect, authenticatedRedirectHome } = require('../../middleware/auth')

const cardController = require('../../controllers/apis/card-controller')
const userAPIController = require('../../controllers/apis/user-controller')
const userController = require('../../controllers/pages/user-controller')

router.get('/record', authenticatedRedirect, (req, res) => res.render('record'))
router.get('/signout', authenticatedRedirect)
router.get('/signin', authenticatedRedirectHome, (req, res) => res.render('signin'))
router.get('/signup', authenticatedRedirectHome, (req, res) => res.render('signup'))
router.get('/', authenticatedRedirect, (req, res) => res.render('index'))
router.use('/', (req, res) => res.redirect('/'))

module.exports = router