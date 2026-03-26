export { OAuthButtons } from './components/oauth-buttons';
export { EmailForm } from './components/email-form';
export { RoleGuard } from './components/role-guard';
export { getUserWithRole } from './hooks/get-user-with-role';
export type { UserWithRole } from './hooks/get-user-with-role';
export { useAuth } from './hooks/use-auth';
export { oauthProviders, protectedRoutes, adminRoutes } from './config/auth-config';
export type { UserRole, OAuthProvider } from './config/auth-config';
