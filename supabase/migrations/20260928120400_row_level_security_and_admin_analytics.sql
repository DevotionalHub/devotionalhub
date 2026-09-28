-- DevotionalHub row-level security, grants, and admin reporting functions.

-- -----------------------------------------------------------------------------
-- Safe public-visibility helpers
-- -----------------------------------------------------------------------------

create or replace function public.devotional_is_public(requested_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.devotionals
    where id = requested_id
      and status in ('scheduled'::public.content_status, 'published'::public.content_status)
      and published_at is not null
      and published_at <= now()
      and devotional_date <= (now() at time zone 'Africa/Lagos')::date
  );
$$;

create or replace function public.reading_plan_is_public(requested_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.reading_plans
    where id = requested_id
      and is_active = true
  );
$$;

create or replace function public.reading_plan_day_is_public(requested_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.reading_plan_days as plan_day
    join public.reading_plans as plan on plan.id = plan_day.reading_plan_id
    where plan_day.id = requested_id
      and plan.is_active = true
  );
$$;

-- -----------------------------------------------------------------------------
-- Enable RLS everywhere in the public API schema
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.bible_translations enable row level security;
alter table public.scripture_passages enable row level security;
alter table public.hymns enable row level security;
alter table public.devotionals enable row level security;
alter table public.topics enable row level security;
alter table public.devotional_topics enable row level security;
alter table public.prayer_points enable row level security;
alter table public.devotional_hymns enable row level security;
alter table public.devotional_revisions enable row level security;
alter table public.reading_plans enable row level security;
alter table public.reading_plan_days enable row level security;
alter table public.reading_plan_items enable row level security;
alter table public.devotional_progress enable row level security;
alter table public.prayer_progress enable row level security;
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.monthly_documents enable row level security;
alter table public.activity_events enable row level security;

-- -----------------------------------------------------------------------------
-- Profiles and roles
-- -----------------------------------------------------------------------------

create policy "Readers can view their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Readers can create their own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "Readers can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Admins can manage all profiles"
  on public.profiles for all to authenticated
  using ((select public.has_role('admin'::public.app_role)))
  with check ((select public.has_role('admin'::public.app_role)));

create policy "Users can view their own staff role"
  on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Admins can manage staff roles"
  on public.user_roles for all to authenticated
  using ((select public.has_role('admin'::public.app_role)))
  with check ((select public.has_role('admin'::public.app_role)));

-- -----------------------------------------------------------------------------
-- Public content and editorial access
-- -----------------------------------------------------------------------------

create policy "Anyone can view republishable Bible translations"
  on public.bible_translations for select to anon, authenticated
  using (can_republish = true);

create policy "Admins can manage Bible translations"
  on public.bible_translations for all to authenticated
  using ((select public.has_role('admin'::public.app_role)))
  with check ((select public.has_role('admin'::public.app_role)));

create policy "Anyone can view passages from republishable translations"
  on public.scripture_passages for select to anon, authenticated
  using (
    exists (
      select 1
      from public.bible_translations
      where code = scripture_passages.translation_code
        and can_republish = true
    )
  );

create policy "Editors can manage Scripture passages"
  on public.scripture_passages for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view active approved hymns"
  on public.hymns for select to anon, authenticated
  using (is_active = true);

create policy "Editors can manage hymns"
  on public.hymns for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view published devotionals"
  on public.devotionals for select to anon, authenticated
  using ((select public.devotional_is_public(id)));

create policy "Editors can manage devotionals"
  on public.devotionals for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view topics"
  on public.topics for select to anon, authenticated
  using (true);

create policy "Editors can manage topics"
  on public.topics for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view topics on published devotionals"
  on public.devotional_topics for select to anon, authenticated
  using ((select public.devotional_is_public(devotional_id)));

create policy "Editors can manage devotional topics"
  on public.devotional_topics for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view prayer points on published devotionals"
  on public.prayer_points for select to anon, authenticated
  using ((select public.devotional_is_public(devotional_id)));

create policy "Editors can manage prayer points"
  on public.prayer_points for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view hymns on published devotionals"
  on public.devotional_hymns for select to anon, authenticated
  using ((select public.devotional_is_public(devotional_id)));

create policy "Editors can assign hymns"
  on public.devotional_hymns for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Editors can view devotional revision history"
  on public.devotional_revisions for select to authenticated
  using ((select public.has_editor_access()));

-- -----------------------------------------------------------------------------
-- Reading plans
-- -----------------------------------------------------------------------------

create policy "Anyone can view active reading plans"
  on public.reading_plans for select to anon, authenticated
  using (is_active = true);

create policy "Editors can manage reading plans"
  on public.reading_plans for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view days in active reading plans"
  on public.reading_plan_days for select to anon, authenticated
  using ((select public.reading_plan_is_public(reading_plan_id)));

create policy "Editors can manage reading plan days"
  on public.reading_plan_days for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

create policy "Anyone can view items in active reading plans"
  on public.reading_plan_items for select to anon, authenticated
  using ((select public.reading_plan_day_is_public(reading_plan_day_id)));

create policy "Editors can manage reading plan items"
  on public.reading_plan_items for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

-- -----------------------------------------------------------------------------
-- Private reader progress
-- -----------------------------------------------------------------------------

create policy "Readers control their devotional progress"
  on public.devotional_progress for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Readers control their prayer progress"
  on public.prayer_progress for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Readers control their Bible reading progress"
  on public.reading_progress for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Readers control their bookmarks"
  on public.bookmarks for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Admins can report on completion state, but no private journal content exists.
create policy "Admins can report on devotional progress"
  on public.devotional_progress for select to authenticated
  using ((select public.has_role('admin'::public.app_role)));

create policy "Admins can report on prayer progress"
  on public.prayer_progress for select to authenticated
  using ((select public.has_role('admin'::public.app_role)));

create policy "Admins can report on Bible reading progress"
  on public.reading_progress for select to authenticated
  using ((select public.has_role('admin'::public.app_role)));

-- -----------------------------------------------------------------------------
-- Monthly documents and analytics
-- -----------------------------------------------------------------------------

create policy "Anyone can view published monthly documents"
  on public.monthly_documents for select to anon, authenticated
  using (
    status = 'published'::public.document_status
    and published_at is not null
    and published_at <= now()
  );

create policy "Editors can manage monthly documents"
  on public.monthly_documents for all to authenticated
  using ((select public.has_editor_access()))
  with check ((select public.has_editor_access()));

-- Event insertion is intentionally reserved for trusted server code using the
-- Supabase secret key (service_role). This prevents clients from fabricating dashboard metrics.
create policy "Admins can view activity events"
  on public.activity_events for select to authenticated
  using ((select public.has_role('admin'::public.app_role)));

create policy "Admins can delete activity events"
  on public.activity_events for delete to authenticated
  using ((select public.has_role('admin'::public.app_role)));

-- -----------------------------------------------------------------------------
-- Explicit Data API grants (RLS still applies to every query)
-- -----------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;

-- Publicly readable content.
grant select on table
  public.bible_translations,
  public.scripture_passages,
  public.hymns,
  public.devotionals,
  public.topics,
  public.devotional_topics,
  public.prayer_points,
  public.devotional_hymns,
  public.reading_plans,
  public.reading_plan_days,
  public.reading_plan_items,
  public.monthly_documents
  to anon, authenticated;

-- Signed-in reader state.
grant select, insert, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on table
  public.devotional_progress,
  public.prayer_progress,
  public.reading_progress,
  public.bookmarks
  to authenticated;

-- Editors and admins receive access through RLS, not broader client keys.
grant insert, update, delete on table
  public.bible_translations,
  public.scripture_passages,
  public.hymns,
  public.devotionals,
  public.topics,
  public.devotional_topics,
  public.prayer_points,
  public.devotional_hymns,
  public.reading_plans,
  public.reading_plan_days,
  public.reading_plan_items,
  public.monthly_documents
  to authenticated;

grant select on public.devotional_revisions to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, delete on public.activity_events to authenticated;

-- Trigger functions are not application RPCs.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.capture_devotional_revision() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.has_editor_access() from public;
revoke all on function public.devotional_is_public(uuid) from public;
revoke all on function public.reading_plan_is_public(uuid) from public;
revoke all on function public.reading_plan_day_is_public(uuid) from public;

grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.has_editor_access() to authenticated;
grant execute on function public.devotional_is_public(uuid) to anon, authenticated;
grant execute on function public.reading_plan_is_public(uuid) to anon, authenticated;
grant execute on function public.reading_plan_day_is_public(uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Admin-only reporting RPCs
-- -----------------------------------------------------------------------------

create or replace function public.get_admin_dashboard_summary(
  p_start_date date default (current_date - 29),
  p_end_date date default current_date
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not public.has_role('admin'::public.app_role) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if p_start_date > p_end_date then
    raise exception 'Start date must be on or before end date' using errcode = '22007';
  end if;

  select jsonb_build_object(
    'periodStart', p_start_date,
    'periodEnd', p_end_date,
    'registeredUsers', (select count(*) from public.profiles),
    'publishedDevotionals', (
      select count(*)
      from public.devotionals
      where status in ('scheduled'::public.content_status, 'published'::public.content_status)
        and published_at <= now()
        and devotional_date <= (now() at time zone 'Africa/Lagos')::date
    ),
    'activeReaders', (
      select count(distinct session_id)
      from public.activity_events
      where occurred_at >= p_start_date::timestamptz
        and occurred_at < (p_end_date + 1)::timestamptz
    ),
    'devotionalViews', (
      select count(*)
      from public.activity_events
      where event_type = 'devotional_view'::public.activity_event_type
        and occurred_at >= p_start_date::timestamptz
        and occurred_at < (p_end_date + 1)::timestamptz
    ),
    'devotionalCompletions', (
      select count(*)
      from public.activity_events
      where event_type = 'devotional_complete'::public.activity_event_type
        and occurred_at >= p_start_date::timestamptz
        and occurred_at < (p_end_date + 1)::timestamptz
    ),
    'prayerCompletions', (
      select count(*)
      from public.activity_events
      where event_type = 'prayer_complete'::public.activity_event_type
        and occurred_at >= p_start_date::timestamptz
        and occurred_at < (p_end_date + 1)::timestamptz
    ),
    'bibleReadingCompletions', (
      select count(*)
      from public.activity_events
      where event_type = 'bible_reading_complete'::public.activity_event_type
        and occurred_at >= p_start_date::timestamptz
        and occurred_at < (p_end_date + 1)::timestamptz
    ),
    'documentDownloads', (
      select count(*)
      from public.activity_events
      where event_type = 'document_download'::public.activity_event_type
        and occurred_at >= p_start_date::timestamptz
        and occurred_at < (p_end_date + 1)::timestamptz
    )
  ) into result;

  return result;
end;
$$;

create or replace function public.get_admin_daily_activity(
  p_start_date date default (current_date - 29),
  p_end_date date default current_date
)
returns table (
  activity_date date,
  event_type public.activity_event_type,
  event_count bigint,
  unique_readers bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.has_role('admin'::public.app_role) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if p_start_date > p_end_date then
    raise exception 'Start date must be on or before end date' using errcode = '22007';
  end if;

  return query
  select
    (events.occurred_at at time zone 'Africa/Lagos')::date as activity_date,
    events.event_type,
    count(*) as event_count,
    count(distinct events.session_id) as unique_readers
  from public.activity_events as events
  where events.occurred_at >= p_start_date::timestamptz
    and events.occurred_at < (p_end_date + 1)::timestamptz
  group by 1, 2
  order by 1, 2;
end;
$$;

revoke all on function public.get_admin_dashboard_summary(date, date) from public;
revoke all on function public.get_admin_daily_activity(date, date) from public;
grant execute on function public.get_admin_dashboard_summary(date, date) to authenticated;
grant execute on function public.get_admin_daily_activity(date, date) to authenticated;
