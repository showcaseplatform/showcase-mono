const { userAuthenticated } = require('../../middlewares/userAuthenticated')

const CausesRouter = require('express').Router()
const causes = require('./causes.js')

CausesRouter.use(userAuthenticated)
CausesRouter.route('').get(causes)

module.exports = { CausesRouter }
