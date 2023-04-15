const models = require('../../models')
const cardServices = require('../../controllers-services/card-services')
const { successResponse, errorResponse } = require('../../helpers/response-helpers')

const cardController = {
    get: async (req, res, next) => {
        cardServices.get(req, (err, status, data) =>
            err
                ? next(err)
                : status === null ? successResponse(res, data) : errorResponse(res, status)
        )
    },
    post: async (req, res) => {
        cardServices.post(req, (err, status, data) =>
            err
                ? next(err)
                : status === null ? successResponse(res, data) : errorResponse(res, status)
        )
    },
    put: async (req, res) => {
        cardServices.put(req, (err, status, data) =>
            err
                ? next(err)
                : status === null ? successResponse(res, data) : errorResponse(res, status)
        )
    }
}

module.exports = cardController
