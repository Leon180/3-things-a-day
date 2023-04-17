const dateServices = require('../../controllers-services/date-services')
const { successResponse, errorResponse } = require('../../helpers/response-helpers')

const dateController = {
  get: async (req, res, next) => {
    dateServices.get(req, (err, status, data) =>
      err
        ? next(err)
        : status === null ? successResponse(res, data) : errorResponse(res, status)
    )
  }
}

module.exports = dateController
