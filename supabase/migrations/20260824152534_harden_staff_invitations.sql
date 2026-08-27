create index staff_invitations_claimed_by_idx
on private.staff_invitations (claimed_by)
where claimed_by is not null;

create policy "staff_invitations_deny_direct_access"
on private.staff_invitations
for all
to public
using (false)
with check (false);
