const AuthRouter = require('express').Router()
const { ROUTE_PATHS } = require('../../consts/routePaths')

AuthRouter.route(ROUTE_PATHS.AUTH.PHONE).post(require('./phone.js'))
AuthRouter.route(ROUTE_PATHS.AUTH.VERIFY_PHONE_CODE).post(require('./verifyPhoneCode.js'))

module.exports = { AuthRouter }
