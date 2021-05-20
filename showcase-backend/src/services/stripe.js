import { stripe as stripeConfig } from '../config'
import Stripe from 'stripe'
const stripe = new Stripe(stripeConfig)

export { stripe }
