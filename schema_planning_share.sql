-- =============================================================================
-- INVITTO — Planeación · add-on COMPARTIR EL PLAN (link de solo lectura)
-- Ejecutar DESPUÉS de schema_planning.sql Y schema_planning_materiales.sql
-- (el RPC lee rental_items, así que esa tabla debe existir antes).
--
--   · La pareja genera un enlace con un token secreto. Cualquiera con el enlace
--     ve el plan en SOLO LECTURA; sin el token no se ve nada (no hay IDOR: el
--     RPC jamás recibe un event_id, solo el token aleatorio).
--   · 100% ADITIVO. No borra ni toca ninguna tabla ni dato existente.
-- =============================================================================

set search_path = invitto, public;

-- Enlaces de compartir: un token aleatorio por evento. revoked = enlace apagado.
create table if not exists planning_shares (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id) on delete cascade not null,
  token       text not null unique default replace(gen_random_uuid()::text, '-', ''),
  revoked     boolean default false,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);

alter table planning_shares enable row level security;

-- Solo el dueño del evento gestiona (crea / revoca / ve) sus enlaces.
drop policy if exists "Owner crud planning_shares" on planning_shares;
create policy "Owner crud planning_shares" on planning_shares for all using (
  exists (select 1 from events e where e.id = planning_shares.event_id and e.user_id = auth.uid()));

create index if not exists idx_shares_event on planning_shares (event_id);
create index if not exists idx_shares_token on planning_shares (token);


-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: get_shared_plan(p_token)  — snapshot de SOLO LECTURA por token.
--   Devuelve null si el token no existe o está revocado. security definer para
--   que un visitante sin sesión (anon) pueda leer SOLO vía token válido.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function get_shared_plan(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = invitto, public
as $$
declare
  v_event_id text;
  v_ev record;
begin
  select event_id into v_event_id
  from planning_shares
  where token = p_token and revoked = false
  limit 1;

  if v_event_id is null then
    return null;
  end if;

  select title, date_time, venue_name into v_ev from events where id = v_event_id;

  return jsonb_build_object(
    'event', jsonb_build_object('title', v_ev.title, 'date_time', v_ev.date_time, 'venue_name', v_ev.venue_name),
    'rubros',       coalesce((select jsonb_agg(to_jsonb(r) order by r.sort_order) from budget_rubros r   where r.event_id = v_event_id), '[]'::jsonb),
    'vendors',      coalesce((select jsonb_agg(to_jsonb(v))                        from vendors v         where v.event_id = v_event_id), '[]'::jsonb),
    'quotes',       coalesce((select jsonb_agg(to_jsonb(q))                        from quotes q          where q.event_id = v_event_id), '[]'::jsonb),
    'payments',     coalesce((select jsonb_agg(to_jsonb(p) order by p.due_date)    from vendor_payments p where p.event_id = v_event_id), '[]'::jsonb),
    'tasks',        coalesce((select jsonb_agg(to_jsonb(t) order by t.sort_order)  from tasks t           where t.event_id = v_event_id), '[]'::jsonb),
    'day_of',       coalesce((select jsonb_agg(to_jsonb(d) order by d.sort_order)  from day_of_items d    where d.event_id = v_event_id), '[]'::jsonb),
    'rental_items', coalesce((select jsonb_agg(to_jsonb(m) order by m.sort_order)  from rental_items m    where m.event_id = v_event_id), '[]'::jsonb)
  );
end;
$$;

grant execute on function get_shared_plan(text) to anon, authenticated;
