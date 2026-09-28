-- Safe lookup data for local development and new environments.
-- No copyrighted devotional messages, Bible passages, or hymn lyrics are seeded.

insert into public.bible_translations (
  code,
  name,
  language_code,
  can_republish,
  copyright_notice,
  source_url
)
values (
  'WEB',
  'World English Bible',
  'en',
  true,
  'The World English Bible is in the public domain.',
  'https://worldenglish.bible/'
)
on conflict (code) do update set
  name = excluded.name,
  language_code = excluded.language_code,
  can_republish = excluded.can_republish,
  copyright_notice = excluded.copyright_notice,
  source_url = excluded.source_url;

insert into public.topics (name, slug, description)
values
  ('Faith', 'faith', 'Trusting God in every season of life.'),
  ('Prayer', 'prayer', 'Growing in a consistent and sincere life of prayer.'),
  ('Hope', 'hope', 'Finding confident hope in God and His promises.'),
  ('Purpose', 'purpose', 'Living intentionally in response to God''s calling.'),
  ('Relationships', 'relationships', 'Honouring God in family, friendship, and community.'),
  ('Spiritual Growth', 'spiritual-growth', 'Developing Christlike character and spiritual maturity.'),
  ('Wisdom', 'wisdom', 'Applying biblical truth to everyday decisions.')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.reading_plans (
  id,
  title,
  slug,
  description,
  start_date,
  end_date,
  is_active
)
values (
  '20260000-0000-4000-8000-000000000001'::uuid,
  'DevotionalHub 2026 Bible Reading Plan',
  'devotionalhub-2026',
  'The date-based daily Bible reading plan for 2026. Activate it after its daily assignments have been reviewed and imported.',
  '2026-01-01'::date,
  '2026-12-31'::date,
  false
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  start_date = excluded.start_date,
  end_date = excluded.end_date;
