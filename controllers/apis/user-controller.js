const userServices = require('../../controllers-services/user-services')
const { successResponse, errorResponse } = require('../../helpers/response-helpers')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, status, data) =>
      err
        ? next(err)
        : status === null ? successResponse(res, data) : errorResponse(res, status)
    )
  },
  signUp: async (req, res, next) => {
    userServices.signUp(req, (err, status, data) =>
      err
        ? next(err)
        : status === null ? successResponse(res, data) : errorResponse(res, status)
    )
  }
}

module.exports = userController
