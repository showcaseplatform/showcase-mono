const AuthRouter = require('express').Router()

AuthRouter.route('/phone').post(require('./phone.js'))
AuthRouter.route('/verifyPhoneCode').post(require('./verifyPhoneCode.js'))

module.exports = { AuthRouter }
