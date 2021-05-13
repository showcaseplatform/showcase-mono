import { Request, Response } from 'express'
import { GetPhoneCodeRequestBody, VerifyPhoneRequestBody } from '../../types/auth'
import { sendPhoneCode } from './sendPhoneCode'
import { verifyPhoneCode } from './verifyPhoneCode'
import Router from 'express-promise-router'

const AuthRouter = Router()

AuthRouter.route('/sendPhoneCode').post(async (req: Request, res: Response) => {
  const { phone, areaCode } = req.body as GetPhoneCodeRequestBody
  await sendPhoneCode({ phone, areaCode })
  res.status(200).send()
})

AuthRouter.route('/verifyPhoneCode').post(async (req: Request, res: Response) => {
  const { code, phone, areaCode } = req.body as VerifyPhoneRequestBody
  const { token, newUser } = await verifyPhoneCode({ code, phone, areaCode })
  res.status(200).send({ token, newUser })
})

export { AuthRouter }
