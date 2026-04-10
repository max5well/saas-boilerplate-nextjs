/**
 * Auth configuration — central place for all auth-related settings.
 *
 * OAuth providers must also be enabled in the Supabase Dashboard:
 *   Settings → Authentication → Providers → Enable Google/GitHub
 *   and add the client ID + secret from each provider.
 */

export type OAuthProvider = 'google' | 'github';

export interface OAuthProviderConfig {
  id: OAuthProvider;
  label: string;
  /** Instructions for setting up this provider in Supabase Dashboard */
  setupNotes: string;
}

export const oauthProviders: OAuthProviderConfig[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    setupNotes:
      'Create OAuth credentials at console.cloud.google.com → APIs & Services → Credentials. Set redirect URI to [SUPABASE_URL]/auth/v1/callback',
  },
  {
    id: 'github',
    label: 'Continue with GitHub',
    setupNotes:
      'Create OAuth App at github.com/settings/developers. Set callback URL to [SUPABASE_URL]/auth/v1/callback',
  },
];

/** Routes that require authentication */
export const protectedRoutes = ['/account', '/manage-subscription'];

/** Routes that require admin role */
export const adminRoutes = ['/admin'];

/** Where to redirect unauthenticated users */
export const loginRedirect = '/login';

/** Where to redirect after login (if no subscription) */
export const pricingRedirect = '/pricing';

/** Where to redirect after login (if subscribed) */
export const defaultRedirect = '/account';

export type UserRole = 'user' | 'admin';
