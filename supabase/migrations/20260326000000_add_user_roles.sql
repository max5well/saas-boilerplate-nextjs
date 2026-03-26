/**
 * USER ROLES
 * Adds a role system to the users table.
 * Default role is 'user'. Only admins (via service role) can promote users.
 */

-- Create the role enum
create type user_role as enum ('user', 'admin');

-- Add role column with default
alter table users add column role user_role not null default 'user';

-- Update RLS: users can read their own role but cannot update it
-- (existing policies already handle select/update on own data)

-- Create a function to check if a user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;

-- Create a policy so admins can read all users
create policy "Admins can view all users."
  on users for select
  using (public.is_admin());

-- Prevent users from updating their own role
-- (the existing update policy allows updating own data, so we add a trigger)
create or replace function public.prevent_role_change()
returns trigger as $$
begin
  if old.role is distinct from new.role then
    -- Only allow if the caller is using the service role (webhooks, admin actions)
    if current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' then
      raise exception 'Users cannot change their own role';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_user_role_change
  before update on public.users
  for each row execute procedure public.prevent_role_change();
