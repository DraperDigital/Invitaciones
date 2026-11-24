-- =============================================================================
-- INVITTO — Planeación · add-on AJUSTES (meta global de presupuesto)
-- Ejecutar DESPUÉS de schema_planning.sql
--
--   · Una fila por evento con la META de presupuesto que fija la pareja.
--     Sirve para calcular "disponible" = meta − contratado, y el sugerido.
--   · 100% ADITIVO. No borra ni toca ninguna tabla ni dato existente.
-- =============================================================================

set search_path = invitto, public;

create table if not exists planning_settings (
  event_id     text primary key references events(id) on delete cascade,
  budget_goal  numeric(12,2),
  updated_at   timestamp with time zone default timezone('utc', now()) not null
);

alter table planning_settings enable row level security;

drop policy if exists "Owner crud planning_settings" on planning_settings;
create policy "Owner crud planning_settings" on planning_settings for all using (
  exists (select 1 from events e where e.id = planning_settings.event_id and e.user_id = auth.uid()));
