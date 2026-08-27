-- One-time, email-bound staff invitations. The table is intentionally kept in
-- the private schema and is never exposed through the Data API.

create table private.staff_invitations (
  email text primary key,
  role public.staff_role not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  claimed_by uuid references auth.users (id) on delete set null,
  constraint staff_invitations_normalized_email_check check (
    email = lower(btrim(email)) and position('@' in email) > 1
  ),
  constraint staff_invitations_claim_check check (
    (claimed_at is null and claimed_by is null) or
    (claimed_at is not null and claimed_by is not null)
  )
);

alter table private.staff_invitations enable row level security;
revoke all on table private.staff_invitations from public, anon, authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  invited_role public.staff_role;
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;

  select invitation.role
  into invited_role
  from private.staff_invitations as invitation
  where invitation.email = lower(btrim(new.email))
    and invitation.claimed_at is null
  for update;

  if invited_role is not null then
    insert into public.staff_members (user_id, role, active)
    values (new.id, invited_role, true)
    on conflict (user_id) do update set
      role = excluded.role,
      active = true,
      updated_at = now();

    update private.staff_invitations
    set claimed_at = now(), claimed_by = new.id
    where email = lower(btrim(new.email))
      and claimed_at is null;
  end if;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
