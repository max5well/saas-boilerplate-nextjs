/**
 * Central site configuration.
 *
 * When you start a new project from this boilerplate, update the values below.
 * Every UI reference to the app name, description, and links pulls from here —
 * there is nothing else to find-and-replace.
 */
export const siteConfig = {
  /** Display name shown in the header, footer, auth screens, and emails. */
  name: 'MyApp',

  /** One-liner used in <meta> description and the landing page subtitle. */
  description: 'The modern SaaS starter you actually want to ship with.',

  /** Canonical production URL (no trailing slash). Used for OG images, emails, etc. */
  url: 'https://myapp.com',

  /** Social / footer links. Set to `null` to hide a link. */
  links: {
    twitter: null as string | null,
    facebook: null as string | null,
    instagram: null as string | null,
    github: null as string | null,
  },

  /** Email sender settings. */
  email: {
    from: 'MyApp <noreply@myapp.com>',
    replyTo: null as string | null,
  },
} as const;
