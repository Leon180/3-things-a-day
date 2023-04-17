// successResponde and errorResponde are used to handle the response of the controller, the controller will call the service and pass the callback function to handle the response.
// successResponde's data: {status, message, data}
// errorResponde's cusErr: {status, message}
const successResponse = (res, data) => res.status(200).json({ data })
const errorResponse = (res, cusErr) => res.status(cusErr.status).json({ message: `error, ${cusErr.message}` })

module.exports = {
  successResponse,
  errorResponse
}