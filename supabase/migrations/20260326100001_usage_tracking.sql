/**
 * USAGE TRACKING
 * Tracks resource usage per user (API calls, storage, etc.)
 * for metered billing and quota enforcement.
 */

create table usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  resource_type text not null,
  quantity integer not null default 1,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Indexes for efficient querying
create index idx_usage_logs_user_id on usage_logs (user_id);
create index idx_usage_logs_resource_type on usage_logs (resource_type);
create index idx_usage_logs_created_at on usage_logs (created_at);
create index idx_usage_logs_user_resource_date on usage_logs (user_id, resource_type, created_at);

-- RLS: users can only see their own usage
alter table usage_logs enable row level security;

create policy "Users can view own usage logs."
  on usage_logs for select
  using (auth.uid() = user_id);

create policy "Service role can insert usage logs."
  on usage_logs for insert
  with check (true);

-- Admins can view all usage logs
create policy "Admins can view all usage logs."
  on usage_logs for select
  using (public.is_admin());
