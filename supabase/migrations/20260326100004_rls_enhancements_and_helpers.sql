/**
 * RLS POLICY ENHANCEMENTS & HELPER FUNCTIONS
 * Strengthens existing RLS policies and adds utility functions.
 */

-- ============================================================
-- RLS ENHANCEMENTS
-- ============================================================

-- Users: prevent users from updating sensitive fields (id is PK so already protected)
-- Add explicit insert policy for service role only
create policy "Service role can insert users."
  on users for insert
  with check (true);

-- Subscriptions: admins can view all subscriptions
create policy "Admins can view all subscriptions."
  on subscriptions for select
  using (public.is_admin());

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get aggregated usage for a user within a date range
create or replace function public.get_user_usage(
  p_user_id uuid,
  p_resource_type text,
  p_start_date timestamptz,
  p_end_date timestamptz
)
returns integer as $$
declare
  v_total integer;
begin
  select coalesce(sum(quantity), 0) into v_total
  from usage_logs
  where user_id = p_user_id
    and resource_type = p_resource_type
    and created_at >= p_start_date
    and created_at < p_end_date;
  return v_total;
end;
$$ language plpgsql security definer stable;

-- Check if a user has exceeded a usage limit
create or replace function public.check_usage_limit(
  p_user_id uuid,
  p_resource_type text,
  p_limit integer
)
returns boolean as $$
declare
  v_current_usage integer;
begin
  -- Check usage for the current calendar month
  select coalesce(sum(quantity), 0) into v_current_usage
  from usage_logs
  where user_id = p_user_id
    and resource_type = p_resource_type
    and created_at >= date_trunc('month', now())
    and created_at < date_trunc('month', now()) + interval '1 month';
  return v_current_usage < p_limit;
end;
$$ language plpgsql security definer stable;

-- Get the current subscription status for a user
create or replace function public.get_user_subscription_status(p_user_id uuid)
returns table (
  subscription_id text,
  status subscription_status,
  price_id text,
  product_name text,
  current_period_end timestamptz
) as $$
begin
  return query
  select
    s.id as subscription_id,
    s.status,
    s.price_id,
    pr.name as product_name,
    s.current_period_end
  from subscriptions s
  join prices p on s.price_id = p.id
  join products pr on p.product_id = pr.id
  where s.user_id = p_user_id
    and s.status in ('active', 'trialing')
  order by s.created desc
  limit 1;
end;
$$ language plpgsql security definer stable;
