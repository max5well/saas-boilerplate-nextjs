/**
 * TEAMS / ORGANIZATIONS (Foundation)
 * Multi-tenant team support with role-based access.
 */

-- Organization roles
create type organization_role as enum ('owner', 'admin', 'member');

-- Organizations table
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users not null,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Organization members junction table
create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations on delete cascade not null,
  user_id uuid references auth.users not null,
  role organization_role not null default 'member',
  invited_by uuid references auth.users,
  joined_at timestamptz default now() not null,
  -- Prevent duplicate memberships
  unique (organization_id, user_id)
);

-- Indexes
create index idx_org_members_org_id on organization_members (organization_id);
create index idx_org_members_user_id on organization_members (user_id);
create index idx_organizations_owner on organizations (owner_id);
create index idx_organizations_slug on organizations (slug);

-- RLS for organizations
alter table organizations enable row level security;

-- Members can view their organizations
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

-- Only org owners/admins can update
create policy "Org owners and admins can update."
  on organizations for update
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Only owners can delete
create policy "Org owners can delete."
  on organizations for delete
  using (owner_id = auth.uid());

-- RLS for organization_members
alter table organization_members enable row level security;

-- Members can see other members of their organizations
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
    -- Also allow the owner to add themselves during org creation
    or (
      auth.uid() = user_id
      and organization_id in (
        select id from organizations where owner_id = auth.uid()
      )
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

-- Org owners/admins can remove members
create policy "Org owners and admins can remove members."
  on organization_members for delete
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
    -- Members can remove themselves
    or user_id = auth.uid()
  );

-- Auto-add owner as a member when org is created
create or replace function public.handle_new_organization()
returns trigger as $$
begin
  insert into public.organization_members (organization_id, user_id, role, invited_by)
  values (new.id, new.owner_id, 'owner', new.owner_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute procedure public.handle_new_organization();
