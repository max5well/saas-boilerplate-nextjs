'use client';

import posthog from 'posthog-js';

/**
 * Initialize PostHog on the client side.
 * Only runs if NEXT_PUBLIC_POSTHOG_KEY is set.
 */
export function initPostHog() {
  if (typeof window === 'undefined') return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: false, // We capture manually via the provider
    capture_pageleave: true,
  });
}

export { posthog };
