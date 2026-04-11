'use server';

import { createElement } from 'react';
import { headers } from 'next/headers';
import { z } from 'zod';

import { siteConfig } from '@/config/site';
import { sendEmail } from '@/features/emails/utils/email-sender';
import { getClientIp, rateLimit } from '@/libs/rate-limit/rate-limiter';
import { ActionResponse } from '@/types/action-response';

import { ContactFormEmail } from '../components/contact-form-email';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export async function submitContactForm(formData: FormData): Promise<ActionResponse> {
  // Rate limit: 5 submissions per minute per IP
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const { success } = rateLimit(`contact:${ip}`, 5);
  if (!success) {
    return { data: null, error: { message: 'Too many requests. Please wait a moment and try again.' } };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { data: null, error: { message: parsed.error.errors[0].message } };
  }

  const { name, email, message } = parsed.data;

  const replyTo = siteConfig.email.replyTo ?? email;

  const result = await sendEmail({
    to: siteConfig.email.from.replace(/^.*<(.+)>$/, '$1'),
    subject: `[${siteConfig.name}] Contact form: ${name}`,
    replyTo,
    react: createElement(ContactFormEmail, { name, email, message }),
    tags: [{ name: 'category', value: 'contact' }],
  });

  if (!result.success) {
    return { data: null, error: { message: 'Failed to send message. Please try again.' } };
  }

  return { data: null, error: null };
}
