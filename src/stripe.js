import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession, createPortalSession } from './firebase'

// Publishable key only (safe for frontend)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

/**
 * Redirect user to Stripe Checkout for a subscription
 * @param {string} priceId - Stripe Price ID (e.g. price_xxx for Pro monthly)
 * @param {string} userId
 * @param {string} userEmail
 */
export async function redirectToCheckout(priceId, userId, userEmail) {
  try {
    const { data } = await createCheckoutSession({
      priceId,
      userId,
      userEmail,
      successUrl: window.location.origin + '/?success=true',
      cancelUrl: window.location.origin + '/pricing?canceled=true'
    })

    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    })

    if (error) {
      console.error('Stripe redirect error:', error)
      throw error
    }
  } catch (err) {
    console.error('Checkout error:', err)
    throw err
  }
}

/**
 * Open Stripe Customer Portal (manage subscription, invoices, cancel)
 */
export async function openCustomerPortal(userId) {
  try {
    const { data } = await createPortalSession({
      userId,
      returnUrl: window.location.origin
    })
    window.location.href = data.url
  } catch (err) {
    console.error('Portal error:', err)
    throw err
  }
}

// Example Price IDs — replace with your real Stripe Price IDs
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: ['20 messages / day', 'Basic history', 'Standard model'],
    messageLimit: 20
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO || 'price_pro_monthly',
    features: ['Unlimited messages', 'Full history', 'Advanced model', 'Image analysis', 'Priority'],
    messageLimit: Infinity
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    price: 49,
    priceId: import.meta.env.VITE_STRIPE_PRICE_UNLIMITED || 'price_unlimited_monthly',
    features: ['Everything in Pro', 'Highest rate limits', 'Early access to new models', 'Priority support'],
    messageLimit: Infinity
  }
}
