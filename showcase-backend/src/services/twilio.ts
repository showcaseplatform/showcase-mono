import { twilio as twilioConfig } from '../config'
import twilio, { Twilio } from 'twilio'

const client = twilio(twilioConfig.account, twilioConfig.token)

class MyTwilio {
  sid: string
  client: Twilio

  constructor() {
    this.client = client
  }

  private ensureValidSid = async () => {
    if (!this.sid) {
      const service = await this.createVerificationService()
      this.sid = service.sid
    }
  }

  private createVerificationService = async () => {
    return await this.client.verify.services.create({
      friendlyName: 'Showcase',
      codeLength: 6,
      lookupEnabled: true,
      skipSmsToLandlines: true,
    })
  }

  sendVerificationToken = async (to: string) => {
    await this.ensureValidSid()
    return await this.client.verify
      .services(this.sid)
      .verifications.create({ to, channel: 'sms' })
  }

  checkVerificationToken = async (to: string, code: string) => {
    await this.ensureValidSid()
    return await this.client.verify
      .services(this.sid)
      .verificationChecks.create({ to, code })
  }
}

const myTwilio = new MyTwilio()

export { myTwilio }
