const helpers = require('../helpers/auth-helper')

const authenticatedRedirect = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticatedRedirect
}
