// successResponde and errorResponde are used to handle the response of the controller, the controller will call the service and pass the callback function to handle the response.
// successResponde's data: {status, message, data}
// errorResponde's status: {code, message}
// status is the status code of the success response, and code is the status code of the error response
const successResponse = (res, data) => res.status(200).json({ data })
const errorResponse = (res, status) => res.status(status.code).json({ message: `error, ${status.message}` })

module.exports = {
  successResponse,
  errorResponse
}