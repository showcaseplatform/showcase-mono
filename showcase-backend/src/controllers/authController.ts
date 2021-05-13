import { Request, Response } from 'express'
import { GetPhoneCodeRequestBody, VerifyPhoneRequestBody } from '../types/auth'
import { sendPhoneCode } from '../libs/auth/sendPhoneCode'
import { verifyPhoneCode } from '../libs/auth/verifyPhoneCode'
import Router from 'express-promise-router'

const AuthController = Router()

AuthController.route('/sendPhoneCode').post(async (req: Request, res: Response) => {
  const { phone, areaCode } = req.body as GetPhoneCodeRequestBody
  await sendPhoneCode({ phone, areaCode })
  res.status(200).send()
})

AuthController.route('/verifyPhoneCode').post(async (req: Request, res: Response) => {
  const { code, phone, areaCode } = req.body as VerifyPhoneRequestBody
  const { token, newUser } = await verifyPhoneCode({ code, phone, areaCode })
  res.status(200).send({ token, newUser })
})

export { AuthController }
