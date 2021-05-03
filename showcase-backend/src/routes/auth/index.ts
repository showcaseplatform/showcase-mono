import express, { Request, Response } from 'express'
import {
  GetPhoneCodeRequestBody,
  VerifyPhoneRequestBody,
} from '../../types/auth'
import { sendPhoneCode } from './sendPhoneCode'
import { verifyPhoneCode } from './verifyPhoneCode'

const AuthRouter = express.Router()

AuthRouter.route('/getPhoneCode').post(async (req: Request, res: Response) => {
  const { phone, areaCode } = req.body as GetPhoneCodeRequestBody
  const { success, error } = await sendPhoneCode({ phone, areaCode })
  if (success && !error) {
    res.status(200).send({ success })
  } else {
    // todo: throw error instead and catch with middleware
    res.status(422).send({ success, error })
  }
})

AuthRouter.route('/verifyPhoneCode').post(async (req: Request, res: Response) => {
  const { code, phone, areaCode } = req.body as VerifyPhoneRequestBody
  const { token, newUser, error } = await verifyPhoneCode({ code, phone, areaCode })
  if(token && !error) {
    res.status(200).send({ token, newUser })
  } else {
    res.status(422).send({ error })
  }
})

export { AuthRouter }
