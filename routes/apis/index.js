const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { errorResponse } = require('../../helpers/response-helpers')
const cardController = require('../../controllers/apis/card-controller')
const userController = require('../../controllers/apis/user-controller')

const lackPasswordOrEmailMessage = {
    code: 400,
    message: 'lack password or email'
}

router.get('/api/card/:id', passport.authenticate('token', { session: false }), cardController.get)
// router.get('/api/card', cardController.get)
router.post('/api/card', passport.authenticate('token', { session: false }), cardController.post)
router.put('/api/card/:id', passport.authenticate('token', { session: false }), cardController.put)
// router.delete('api/card/:id', cardController.delete)
router.post('/api/signin', (req, res, next) => {
    if (!req.body.email || !req.body.password) errorResponse(res, lackPasswordOrEmailMessage)
    next()
}, passport.authenticate('signin', { session: false }), userController.signIn)
router.post('/api/signup', userController.signUp)

router.use('/', apiErrorHandler)
module.exports = router
