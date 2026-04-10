export { EmailForm } from './components/email-form';
export { OAuthButtons } from './components/oauth-buttons';
export { RoleGuard } from './components/role-guard';
export type { OAuthProvider,UserRole } from './config/auth-config';
export { adminRoutes,oauthProviders, protectedRoutes } from './config/auth-config';
export type { UserWithRole } from './hooks/get-user-with-role';
export { getUserWithRole } from './hooks/get-user-with-role';
export { useAuth } from './hooks/use-auth';
