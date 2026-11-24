-- =============================================================================
-- INVITTO — Planeación · add-on MATERIALES / INVENTARIO DE ALQUILER
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema_planning.sql
--
--   · Inventario de lo rentado (sillas, mantelería, vajilla, pista…) con
--     cantidad, proveedor y estado devuelto/pendiente. Cuelga del evento.
--   · 100% ADITIVO: no borra ni toca ninguna tabla ni dato existente.
--   · Mismo patrón RLS / índices / event_id text que el resto del módulo.
-- =============================================================================

set search_path = invitto, public;

create table if not exists rental_items (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id)  on delete cascade not null,
  name        text not null,
  qty         integer default 1,
  vendor_id   uuid references vendors(id) on delete set null,
  status      text not null default 'pending',   -- 'pending' | 'returned'
  notes       text,
  sort_order  integer default 0,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);

alter table rental_items enable row level security;

create policy "Owner crud rental_items" on rental_items for all using (
  exists (select 1 from events e where e.id = rental_items.event_id and e.user_id = auth.uid()));

create index if not exists idx_rental_event  on rental_items (event_id);
create index if not exists idx_rental_vendor on rental_items (vendor_id);
