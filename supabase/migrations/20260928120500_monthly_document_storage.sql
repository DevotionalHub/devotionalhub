-- Private storage for generated monthly DOCX files.
-- Readers download through trusted server code that logs the event and returns a
-- short-lived signed URL. Direct public bucket access is intentionally disabled.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'monthly-devotionals',
  'monthly-devotionals',
  false,
  52428800,
  array['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Editors can view monthly devotional files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'monthly-devotionals'
    and (select public.has_editor_access())
  );

create policy "Editors can upload monthly devotional files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'monthly-devotionals'
    and (select public.has_editor_access())
  );

create policy "Editors can update monthly devotional files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'monthly-devotionals'
    and (select public.has_editor_access())
  )
  with check (
    bucket_id = 'monthly-devotionals'
    and (select public.has_editor_access())
  );

create policy "Editors can delete monthly devotional files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'monthly-devotionals'
    and (select public.has_editor_access())
  );
