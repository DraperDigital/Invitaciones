-- =============================================================================
-- INVITTO — Configuración de Almacenamiento de Imágenes (Supabase Storage)
-- Ejecutar este script completo en el SQL Editor de tu Dashboard de Supabase.
-- =============================================================================

-- 1. Crear el bucket publico 'event-images' si no existe
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-images', 
  'event-images', 
  true, 
  5242880, -- Límite de 5MB
  '{"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"}'
)
on conflict (id) do nothing;

-- 2. Asegurar que RLS esté activado en storage.objects
alter table storage.objects enable row level security;

-- 3. Limpiar políticas previas para evitar duplicados
drop policy if exists "Acceso publico para event-images" on storage.objects;
drop policy if exists "Usuarios pueden subir imagenes de sus eventos" on storage.objects;
drop policy if exists "Usuarios pueden actualizar imagenes de sus eventos" on storage.objects;
drop policy if exists "Usuarios pueden borrar imagenes de sus eventos" on storage.objects;

-- 4. Crear política de lectura pública (cualquier persona puede ver las imágenes de invitación)
create policy "Acceso publico para event-images"
on storage.objects for select
using (bucket_id = 'event-images');

-- 5. Crear política de subida segura (solo el creador del evento puede subir a su propia carpeta events/ID/*)
create policy "Usuarios pueden subir imagenes de sus eventos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'event-images' 
  and (storage.foldername(name))[1] = 'events'
  and exists (
    select 1 from public.events
    where id::text = (storage.foldername(name))[2]
      and user_id = auth.uid()
  )
);

-- 6. Crear política de actualización (solo el dueño puede sobrescribir sus imágenes)
create policy "Usuarios pueden actualizar imagenes de sus eventos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'event-images' 
  and (storage.foldername(name))[1] = 'events'
  and exists (
    select 1 from public.events
    where id::text = (storage.foldername(name))[2]
      and user_id = auth.uid()
  )
);

-- 7. Crear política de eliminación (solo el dueño puede borrar sus imágenes)
create policy "Usuarios pueden borrar imagenes de sus eventos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'event-images' 
  and (storage.foldername(name))[1] = 'events'
  and exists (
    select 1 from public.events
    where id::text = (storage.foldername(name))[2]
      and user_id = auth.uid()
  )
);
