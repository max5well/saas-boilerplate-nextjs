/**
 * TEAMS / ORGANIZATIONS (Foundation)
 * Multi-tenant team support with role-based membership.
 */

-- Organization role enum
create type org_member_role as enum ('owner', 'admin', 'member');

-- Organizations table
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users not null,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index idx_organizations_owner on organizations(owner_id);
create index idx_organizations_slug on organizations(slug);

alter table organizations enable row level security;

-- Members can view their own organizations
create policy "Members can view their organizations."
  on organizations for select
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

-- Only authenticated users can create organizations
create policy "Authenticated users can create organizations."
  on organizations for insert
  with check (auth.uid() = owner_id);

-- Only org owners/admins can update organization settings
create policy "Org owners and admins can update their organization."
  on organizations for update
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Only org owners can delete organizations
create policy "Org owners can delete their organization."
  on organizations for delete
  using (owner_id = auth.uid());

-- Organization members table
create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade not null,
  user_id uuid references auth.users not null,
  role org_member_role not null default 'member',
  invited_by uuid references auth.users,
  joined_at timestamptz default now() not null,
  unique(organization_id, user_id)
);

create index idx_org_members_org on organization_members(organization_id);
create index idx_org_members_user on organization_members(user_id);

alter table organization_members enable row level security;

-- Members can view other members in their organizations
create policy "Members can view org members."
  on organization_members for select
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

-- Org owners/admins can add members
create policy "Org owners and admins can add members."
  on organization_members for insert
  with check (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Org owners/admins can update member roles
create policy "Org owners and admins can update members."
  on organization_members for update
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Org owners/admins can remove members, members can remove themselves
create policy "Org owners/admins can remove members, self-remove allowed."
  on organization_members for delete
  using (
    user_id = auth.uid()
    or organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Auto-add owner as member when org is created
create or replace function public.handle_new_organization()
returns trigger as $$
begin
  insert into public.organization_members (organization_id, user_id, role, invited_by, joined_at)
  values (new.id, new.owner_id, 'owner', new.owner_id, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute procedure public.handle_new_organization();

-- Helper: check if user is member of org
create or replace function public.is_org_member(org_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.organization_members
    where organization_id = org_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer stable;

-- Helper: check user's role in org
create or replace function public.get_org_role(org_id uuid)
returns org_member_role as $$
declare
  member_role org_member_role;
begin
  select role into member_role
  from public.organization_members
  where organization_id = org_id
  and user_id = auth.uid();
  return member_role;
end;
$$ language plpgsql security definer stable;
