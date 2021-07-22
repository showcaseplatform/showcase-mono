import { stripe as stripeConfig } from '../config'
import Stripe from 'stripe'
import Boom from 'boom'
import { Currency } from '@prisma/client'



// todo: convert this class to selected payment provider
class MyStripe {
  stripe = new Stripe(stripeConfig, { apiVersion: '2020-08-27' })

  constructor() {}

  async refundPayment(id: string) {
    await this.stripe.refunds.create({ charge: id })
  }

  async chargeAccount({
    amount,
    currency,
    customerStripeId,
    badgeItemId,
    title,
    creatorProfileId,
  }: {
    amount: number
    currency: Currency
    customerStripeId: string
    badgeItemId: string
    title: string
    creatorProfileId: string
  }) {
    // todo: test this if its correct
    const twoDecimalCurrencyMultiplier = 100
    const charge = await this.stripe.charges.create({
      amount: amount * twoDecimalCurrencyMultiplier,
      currency,
      customer: customerStripeId,
      description: 'Showcase Badge "' + title + '" (ID: ' + badgeItemId + ')',
      metadata: {
        badgeid: badgeItemId,
        badgename: title,
        creatorid: creatorProfileId,
      },
      // todo: when should we include emails?
      //receipt_email: user.email || null, //avoid email for now..
    })
  
    if (!charge || !charge.id || !charge.paid) {
      throw Boom.internal('Unable to create charge')
    }
  
    return { chargeId: charge.id }
  }


}

export const stripe = new MyStripe()
