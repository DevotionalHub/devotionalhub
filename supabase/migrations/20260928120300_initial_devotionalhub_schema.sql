-- DevotionalHub initial data model
-- Content, editorial workflow, reader progress, downloads, and privacy-conscious analytics.

create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('editor', 'admin');
create type public.content_status as enum ('draft', 'in_review', 'scheduled', 'published', 'archived');
create type public.copyright_status as enum ('public_domain', 'original', 'licensed');
create type public.document_status as enum ('draft', 'published', 'archived');
create type public.activity_event_type as enum (
  'devotional_view',
  'devotional_complete',
  'prayer_complete',
  'bible_reading_complete',
  'bookmark',
  'share',
  'document_download'
);

-- -----------------------------------------------------------------------------
-- Accounts and staff roles
-- -----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Reader' check (char_length(display_name) between 1 and 80),
  avatar_url text,
  timezone text not null default 'Africa/Lagos' check (char_length(timezone) between 1 and 64),
  preferences jsonb not null default '{}'::jsonb check (jsonb_typeof(preferences) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references auth.users (id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- These security-definer helpers avoid recursive RLS checks on user_roles.
create or replace function public.has_role(requested_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = requested_role
  );
$$;

create or replace function public.has_editor_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role in ('editor'::public.app_role, 'admin'::public.app_role)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Reader'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Scripture, hymns, and devotional content
-- -----------------------------------------------------------------------------

create table public.bible_translations (
  code text primary key check (code ~ '^[A-Z0-9_-]{2,20}$'),
  name text not null,
  language_code text not null default 'en',
  can_republish boolean not null default false,
  copyright_notice text,
  source_url text,
  created_at timestamptz not null default now()
);

create table public.scripture_passages (
  id uuid primary key default extensions.gen_random_uuid(),
  translation_code text not null references public.bible_translations (code) on update cascade,
  reference text not null check (char_length(reference) between 2 and 120),
  passage_text text not null check (char_length(trim(passage_text)) > 0),
  source_url text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (translation_code, reference)
);

create table public.hymns (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  author_name text,
  composer_name text,
  lyrics text not null check (char_length(trim(lyrics)) > 0),
  copyright_status public.copyright_status not null,
  attribution text,
  source_url text,
  license_notes text,
  is_active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint licensed_hymn_requires_notes check (
    copyright_status <> 'licensed'::public.copyright_status
    or nullif(trim(license_notes), '') is not null
  )
);

create table public.devotionals (
  id uuid primary key default extensions.gen_random_uuid(),
  devotional_date date not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 180),
  summary text check (summary is null or char_length(summary) <= 320),
  memory_verse_id uuid references public.scripture_passages (id) on delete restrict,
  main_passage_id uuid references public.scripture_passages (id) on delete restrict,
  message text not null default '',
  reflection_question text,
  action_point text,
  author_name text not null default 'DevotionalHub Editorial Team',
  status public.content_status not null default 'draft',
  seo_description text check (seo_description is null or char_length(seo_description) <= 320),
  created_by uuid references auth.users (id) on delete set null,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publication_requires_complete_review check (
    status not in ('scheduled'::public.content_status, 'published'::public.content_status)
    or (
      memory_verse_id is not null
      and main_passage_id is not null
      and char_length(trim(message)) > 0
      and reviewed_by is not null
      and reviewed_at is not null
      and published_at is not null
    )
  )
);

create table public.topics (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  created_at timestamptz not null default now()
);

create table public.devotional_topics (
  devotional_id uuid not null references public.devotionals (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  primary key (devotional_id, topic_id)
);

create table public.prayer_points (
  id uuid primary key default extensions.gen_random_uuid(),
  devotional_id uuid not null references public.devotionals (id) on delete cascade,
  sort_order smallint not null check (sort_order > 0),
  content text not null check (char_length(trim(content)) > 0),
  scripture_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (devotional_id, sort_order)
);

create table public.devotional_hymns (
  devotional_id uuid primary key references public.devotionals (id) on delete cascade,
  hymn_id uuid not null references public.hymns (id) on delete restrict,
  note text,
  created_at timestamptz not null default now()
);

-- Every update stores the previous devotional state for editorial accountability.
create table public.devotional_revisions (
  id bigint generated always as identity primary key,
  devotional_id uuid not null references public.devotionals (id) on delete cascade,
  snapshot jsonb not null,
  changed_by uuid references auth.users (id) on delete set null,
  changed_at timestamptz not null default now()
);

create or replace function public.capture_devotional_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if to_jsonb(old) is distinct from to_jsonb(new) then
    insert into public.devotional_revisions (devotional_id, snapshot, changed_by)
    values (old.id, to_jsonb(old), (select auth.uid()));
  end if;

  return new;
end;
$$;

create trigger capture_devotional_revision_before_update
  before update on public.devotionals
  for each row execute procedure public.capture_devotional_revision();

-- -----------------------------------------------------------------------------
-- Date-based Bible reading plans
-- -----------------------------------------------------------------------------

create table public.reading_plans (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.reading_plan_days (
  id uuid primary key default extensions.gen_random_uuid(),
  reading_plan_id uuid not null references public.reading_plans (id) on delete cascade,
  plan_date date not null,
  day_number smallint not null check (day_number > 0),
  title text,
  introduction text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reading_plan_id, plan_date),
  unique (reading_plan_id, day_number)
);

create table public.reading_plan_items (
  id uuid primary key default extensions.gen_random_uuid(),
  reading_plan_day_id uuid not null references public.reading_plan_days (id) on delete cascade,
  sort_order smallint not null check (sort_order > 0),
  scripture_reference text not null check (char_length(scripture_reference) between 2 and 120),
  passage_id uuid references public.scripture_passages (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (reading_plan_day_id, sort_order)
);

-- -----------------------------------------------------------------------------
-- Signed-in reader state
-- -----------------------------------------------------------------------------

create table public.devotional_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  devotional_id uuid not null references public.devotionals (id) on delete cascade,
  started_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, devotional_id)
);

create table public.prayer_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  prayer_point_id uuid not null references public.prayer_points (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, prayer_point_id)
);

create table public.reading_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  reading_plan_item_id uuid not null references public.reading_plan_items (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, reading_plan_item_id)
);

create table public.bookmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  devotional_id uuid not null references public.devotionals (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, devotional_id)
);

-- -----------------------------------------------------------------------------
-- Monthly DOCX files and aggregate activity
-- -----------------------------------------------------------------------------

create table public.monthly_documents (
  id uuid primary key default extensions.gen_random_uuid(),
  month_start date not null,
  version integer not null default 1 check (version > 0),
  title text not null check (char_length(title) between 1 and 180),
  file_path text not null check (char_length(trim(file_path)) > 0),
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  checksum_sha256 text check (checksum_sha256 is null or checksum_sha256 ~ '^[a-f0-9]{64}$'),
  status public.document_status not null default 'draft',
  generated_by uuid references auth.users (id) on delete set null,
  generated_at timestamptz not null default now(),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (month_start, version),
  check (extract(day from month_start) = 1),
  constraint published_document_requires_date check (
    status <> 'published'::public.document_status or published_at is not null
  )
);

create unique index one_published_document_per_month
  on public.monthly_documents (month_start)
  where status = 'published'::public.document_status;

-- No prayer text, email, IP address, or private notes are stored here. The app
-- should generate a random session UUID in the browser and respect analytics
-- consent. A session remains non-identifying when user_id is null.
create table public.activity_events (
  id bigint generated always as identity primary key,
  event_type public.activity_event_type not null,
  user_id uuid references auth.users (id) on delete set null,
  session_id uuid not null,
  devotional_id uuid references public.devotionals (id) on delete set null,
  prayer_point_id uuid references public.prayer_points (id) on delete set null,
  reading_plan_item_id uuid references public.reading_plan_items (id) on delete set null,
  monthly_document_id uuid references public.monthly_documents (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint event_metadata_is_small_object check (
    jsonb_typeof(metadata) = 'object' and pg_column_size(metadata) <= 4096
  )
);

-- -----------------------------------------------------------------------------
-- Shared triggers and indexes
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_scripture_passages_updated_at before update on public.scripture_passages
  for each row execute procedure public.set_updated_at();
create trigger set_hymns_updated_at before update on public.hymns
  for each row execute procedure public.set_updated_at();
create trigger set_devotionals_updated_at before update on public.devotionals
  for each row execute procedure public.set_updated_at();
create trigger set_prayer_points_updated_at before update on public.prayer_points
  for each row execute procedure public.set_updated_at();
create trigger set_reading_plans_updated_at before update on public.reading_plans
  for each row execute procedure public.set_updated_at();
create trigger set_reading_plan_days_updated_at before update on public.reading_plan_days
  for each row execute procedure public.set_updated_at();
create trigger set_monthly_documents_updated_at before update on public.monthly_documents
  for each row execute procedure public.set_updated_at();

create index devotionals_publication_lookup_idx
  on public.devotionals (devotional_date desc, published_at)
  where status in ('scheduled'::public.content_status, 'published'::public.content_status);
create index devotionals_status_idx on public.devotionals (status, devotional_date desc);
create index prayer_points_devotional_idx on public.prayer_points (devotional_id, sort_order);
create index devotional_topics_topic_idx on public.devotional_topics (topic_id, devotional_id);
create index reading_plan_days_date_idx on public.reading_plan_days (plan_date);
create index reading_plan_items_day_idx on public.reading_plan_items (reading_plan_day_id, sort_order);
create index devotional_progress_user_completed_idx on public.devotional_progress (user_id, completed_at);
create index prayer_progress_user_completed_idx on public.prayer_progress (user_id, completed_at desc);
create index reading_progress_user_completed_idx on public.reading_progress (user_id, completed_at desc);
create index activity_events_occurred_idx on public.activity_events (occurred_at desc);
create index activity_events_type_occurred_idx on public.activity_events (event_type, occurred_at desc);
create index activity_events_devotional_idx on public.activity_events (devotional_id, occurred_at desc)
  where devotional_id is not null;
create index activity_events_user_idx on public.activity_events (user_id, occurred_at desc)
  where user_id is not null;
create index activity_events_session_idx on public.activity_events (session_id, occurred_at desc);
