import { redirect } from 'next/navigation';

import { getUserWithRole } from '@/features/auth/hooks/get-user-with-role';
import { getSupabaseAdmin } from '@/libs/supabase/supabase-admin';

export const metadata = { title: 'Admin' };

export default async function AdminPage() {
  const currentUser = await getUserWithRole();

  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/');
  }

  const supabase = getSupabaseAdmin();

  // Run all queries in parallel
  const [usersResult, usersCountResult, subsCountResult] = await Promise.all([
    supabase.from('users').select('id, full_name, role').order('id').limit(100),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).in('status', ['active', 'trialing']),
  ]);

  const users = usersResult.data;
  if (usersResult.error) console.error('[Admin] Failed to fetch users:', usersResult.error);
  const totalUsers = usersCountResult.count;
  const totalSubscriptions = subsCountResult.count;

  return (
    <section className='rounded-lg bg-card px-4 py-16'>
      <h1 className='mb-8 text-center'>Admin Dashboard</h1>

      <div className='m-auto flex max-w-4xl flex-col gap-8'>
        {/* Stats */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <StatCard label='Total users' value={totalUsers ?? 0} />
          <StatCard label='Active subscriptions' value={totalSubscriptions ?? 0} />
          <StatCard
            label='Conversion rate'
            value={
              totalUsers && totalSubscriptions
                ? `${Math.round((totalSubscriptions / totalUsers) * 100)}%`
                : '—'
            }
          />
        </div>

        {/* User list */}
        <div className='rounded-md bg-muted'>
          <div className='p-4'>
            <h2 className='mb-1 text-xl font-semibold'>Users</h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='border-t border-border text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3 font-medium'>ID</th>
                  <th className='px-4 py-3 font-medium'>Name</th>
                  <th className='px-4 py-3 font-medium'>Role</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((user) => (
                  <tr key={user.id} className='border-t border-border'>
                    <td className='px-4 py-3 font-mono text-xs'>{user.id.slice(0, 8)}...</td>
                    <td className='px-4 py-3'>{user.full_name || '—'}</td>
                    <td className='px-4 py-3'>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='rounded-lg border border-border bg-muted p-6'>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='mt-1 text-3xl font-bold'>{value}</p>
    </div>
  );
}
