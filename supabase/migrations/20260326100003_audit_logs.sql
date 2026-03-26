/**
 * AUDIT LOGS
 * Tracks user actions for security, compliance, and debugging.
 * Only admins can read audit logs via RLS.
 */

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now() not null
);

-- Indexes for efficient querying
create index idx_audit_logs_user_id on audit_logs (user_id);
create index idx_audit_logs_action on audit_logs (action);
create index idx_audit_logs_resource on audit_logs (resource_type, resource_id);
create index idx_audit_logs_created_at on audit_logs (created_at);

-- RLS: admins only
alter table audit_logs enable row level security;

create policy "Admins can view audit logs."
  on audit_logs for select
  using (public.is_admin());

create policy "Service role can insert audit logs."
  on audit_logs for insert
  with check (true);

-- Helper function to create audit log entries (called from server-side code)
create or replace function public.create_audit_log(
  p_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid default null,
  p_metadata jsonb default '{}'::jsonb,
  p_ip_address inet default null,
  p_user_agent text default null
)
returns uuid as $$
declare
  v_id uuid;
begin
  insert into audit_logs (user_id, action, resource_type, resource_id, metadata, ip_address, user_agent)
  values (p_user_id, p_action, p_resource_type, p_resource_id, p_metadata, p_ip_address, p_user_agent)
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql security definer;
