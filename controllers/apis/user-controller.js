const userServices = require('../../controllers-services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, status, data) =>
      err
        ? next(err)
        : status === null ? res.status(200).json({
          message: "success",
          data: {
            user: data
          }
        }) : res.status(status.code).json({
          message: `error, ${status.message}`
        })
    )
  },
  signUp: async (req, res, next) => {
    userServices.signUp(req, (err, status, data) =>
      err
        ? next(err)
        : status === null ? res.status(200).json({
          message: "success",
          data: {
            user: data
          }
        }) : res.status(status.code).json({
          message: `error, ${status.message}`
        })
    )
  }
}

module.exports = userController
