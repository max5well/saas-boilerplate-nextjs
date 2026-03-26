/**
 * RLS POLICY ENHANCEMENTS
 * Strengthens existing policies and adds helper functions for usage/subscription checks.
 */

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
returns bigint as $$
declare
  total bigint;
begin
  select coalesce(sum(quantity), 0) into total
  from public.usage_logs
  where user_id = p_user_id
    and resource_type = p_resource_type
    and created_at >= p_start_date
    and created_at < p_end_date;
  return total;
end;
$$ language plpgsql security definer stable;

-- Check if a user has exceeded a usage limit
create or replace function public.check_usage_limit(
  p_user_id uuid,
  p_limit bigint
)
returns boolean as $$
declare
  current_usage bigint;
begin
  select coalesce(sum(quantity), 0) into current_usage
  from public.usage_logs
  where user_id = p_user_id
    and created_at >= date_trunc('month', now())
    and created_at < date_trunc('month', now()) + interval '1 month';
  return current_usage < p_limit;
end;
$$ language plpgsql security definer stable;

-- Get a user's current subscription status
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
  from public.subscriptions s
  left join public.prices p on s.price_id = p.id
  left join public.products pr on p.product_id = pr.id
  where s.user_id = p_user_id
    and s.status in ('active', 'trialing')
  order by s.created desc
  limit 1;
end;
$$ language plpgsql security definer stable;

-- ============================================================
-- SUBSCRIPTION RLS ENHANCEMENT
-- ============================================================

-- Admins can view all subscriptions
create policy "Admins can view all subscriptions."
  on subscriptions for select
  using (public.is_admin());

-- ============================================================
-- USERS TABLE RLS ENHANCEMENT
-- ============================================================

-- Allow org members to view basic profile info of fellow members
create policy "Org members can view fellow member profiles."
  on users for select
  using (
    id in (
      select om2.user_id
      from organization_members om1
      join organization_members om2 on om1.organization_id = om2.organization_id
      where om1.user_id = auth.uid()
    )
  );
