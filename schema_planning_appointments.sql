-- =============================================================================
-- INVITTO — Planeación · add-on CITAS / AGENDA (calendario)
-- Ejecutar DESPUÉS de schema_planning.sql
--
--   · Citas con proveedores (prueba de menú, sesión de fotos, prueba de vestido…)
--     que se pintan en el calendario junto con pagos y tareas.
--   · 100% ADITIVO. No borra ni toca ninguna tabla ni dato existente.
-- =============================================================================

set search_path = invitto, public;

create table if not exists appointments (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id)  on delete cascade not null,
  title       text not null,
  date        date not null,
  time        text,
  vendor_id   uuid references vendors(id) on delete set null,
  location    text,
  notes       text,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);

alter table appointments enable row level security;

create policy "Owner crud appointments" on appointments for all using (
  exists (select 1 from events e where e.id = appointments.event_id and e.user_id = auth.uid()));

create index if not exists idx_appointments_event on appointments (event_id, date);
