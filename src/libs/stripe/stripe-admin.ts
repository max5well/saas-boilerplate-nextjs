import Stripe from 'stripe';

import { siteConfig } from '@/config/site';

let _stripe: Stripe | null = null;

function getStripeAdmin(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      'Missing STRIPE_SECRET_KEY env var. Copy .env.example → .env.local and fill in your Stripe secret key.'
    );
  }

  _stripe = new Stripe(key, {
    apiVersion: '2023-10-16',
    appInfo: {
      name: siteConfig.name,
      version: '0.1.0',
    },
  });

  return _stripe;
}

/** Lazy Stripe client — only initializes when first accessed at runtime. */
export const stripeAdmin = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripeAdmin(), prop, receiver);
  },
});
