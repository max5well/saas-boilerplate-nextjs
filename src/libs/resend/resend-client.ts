import { Resend } from 'resend';

let _client: Resend | null = null;

export function getResendClient(): Resend {
  if (_client) return _client;

  const key = process.env.RESEND_API_KEY;

  if (!key) {
    throw new Error(
      'Missing RESEND_API_KEY env var. Copy .env.example → .env.local and fill in your Resend API key.'
    );
  }

  _client = new Resend(key);
  return _client;
}

/** Lazy Resend client — only initializes when first accessed at runtime. */
export const resendClient = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    return Reflect.get(getResendClient(), prop, receiver);
  },
});
