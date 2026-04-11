const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {};

// Only wrap with Sentry if the DSN is configured
module.exports = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      // Suppresses source map uploading logs during build
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    })
  : nextConfig;
