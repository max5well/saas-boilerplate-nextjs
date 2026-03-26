import { redirect } from 'next/navigation';

import { loginRedirect, type UserRole } from '@/features/auth/config/auth-config';
import { getUserWithRole } from '@/features/auth/hooks/get-user-with-role';

/**
 * Server component that guards its children behind role-based access.
 *
 * Usage:
 *   <RoleGuard requiredRole="admin">
 *     <AdminPanel />
 *   </RoleGuard>
 */
export async function RoleGuard({
  requiredRole,
  children,
  fallback,
}: {
  requiredRole: UserRole;
  children: React.ReactNode;
  /** Optional: render this instead of redirecting when role doesn't match */
  fallback?: React.ReactNode;
}) {
  const user = await getUserWithRole();

  if (!user) {
    redirect(loginRedirect);
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect('/');
  }

  return <>{children}</>;
}
