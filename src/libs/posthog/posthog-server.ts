import { PostHog } from 'posthog-node';

let _client: PostHog | null = null;

/**
 * Lazy PostHog server client. Returns null if POSTHOG_API_KEY is not set.
 */
export function getPostHogServer(): PostHog | null {
  const key = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  if (_client) return _client;

  _client = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  });

  return _client;
}
