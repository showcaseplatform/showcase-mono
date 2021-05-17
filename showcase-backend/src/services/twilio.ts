import { twilio as twilioConfig } from '../config'
import twilio from 'twilio'

const twiloClient = twilio(twilioConfig.account, twilioConfig.token)

export { twiloClient as twilio }