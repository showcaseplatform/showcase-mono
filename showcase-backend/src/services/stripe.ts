import { stripe as stripeConfig } from '../config'
import Stripe from 'stripe'
const stripe = new Stripe(stripeConfig, { apiVersion: '2020-08-27' })

export { stripe }
