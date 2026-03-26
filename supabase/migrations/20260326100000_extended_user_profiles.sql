/**
 * EXTENDED USER PROFILES
 * Adds profile fields, preferences, and timestamps to the users table.
 * Note: avatar_url already exists from init migration.
 */

-- Add profile columns
alter table users add column bio text;
alter table users add column company text;
alter table users add column website text;
alter table users add column timezone text default 'UTC';
alter table users add column preferences jsonb default '{"theme": "system", "language": "en", "notifications": {"email": true, "push": true}}'::jsonb;
alter table users add column metadata jsonb default '{}'::jsonb;
alter table users add column created_at timestamptz default now();
alter table users add column updated_at timestamptz default now();

-- Backfill created_at for existing rows
update users set created_at = now() where created_at is null;

-- Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- Update the handle_new_user function to set timestamps
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;
