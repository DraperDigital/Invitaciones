-- =============================================================================
-- INVITTO — Security Fix: RLS + RPC functions
-- Ejecutar en Supabase SQL Editor sobre una base de datos existente.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Eliminar políticas RLS inseguras
-- ─────────────────────────────────────────────────────────────────────────────

-- Política que permitía SELECT de TODOS los guests sin autenticación
drop policy if exists "Guest access via token" on guests;

-- Políticas de RSVPs que no validaban el token del invitado
drop policy if exists "Guests can create rsvp" on rsvps;
drop policy if exists "Guests can update own rsvp" on rsvps;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Funciones SECURITY DEFINER para acceso seguro anónimo
-- ─────────────────────────────────────────────────────────────────────────────

-- get_guest_by_token: Retorna guest + RSVP existente validando token y slug del evento.
-- Acepta tanto guest_token (UUID de invitación) como guest.id (UUID del QR de acceso).
create or replace function get_guest_by_token(p_token uuid, p_slug text)
returns json
language plpgsql
security definer
stable
as $$
declare
  v_result json;
begin
  select json_build_object(
    'guest', row_to_json(g.*),
    'rsvp',  (select row_to_json(r.*) from rsvps r where r.guest_id = g.id)
  )
  into v_result
  from guests g
  join events e on e.id = g.event_id
  where (g.guest_token = p_token or g.id = p_token)
    and e.slug        = p_slug
    and e.is_published = true;

  return v_result;
end;
$$;

-- submit_rsvp_by_token: Valida token + slug y hace upsert del RSVP de forma segura.
create or replace function submit_rsvp_by_token(
  p_token      uuid,
  p_slug       text,
  p_status     text,
  p_plus_ones  integer default 0,
  p_dietary    text    default null,
  p_message    text    default null
)
returns json
language plpgsql
security definer
as $$
declare
  v_guest guests%rowtype;
begin
  if p_status not in ('yes', 'no', 'maybe') then
    raise exception 'invalid_status';
  end if;

  select g.* into v_guest
  from guests g
  join events e on e.id = g.event_id
  where (g.guest_token = p_token or g.id = p_token)
    and e.slug        = p_slug
    and e.is_published = true;

  if v_guest.id is null then
    raise exception 'invalid_token';
  end if;

  if p_plus_ones < 0 or p_plus_ones > coalesce(v_guest.max_plus_ones, 0) then
    raise exception 'invalid_plus_ones';
  end if;

  insert into rsvps (event_id, guest_id, status, plus_ones_confirmed, dietary_restrictions, message)
  values (v_guest.event_id, v_guest.id, p_status, p_plus_ones, p_dietary, p_message)
  on conflict (guest_id) do update set
    status               = excluded.status,
    plus_ones_confirmed  = excluded.plus_ones_confirmed,
    dietary_restrictions = excluded.dietary_restrictions,
    message              = excluded.message;

  update guests
  set status = case p_status
    when 'yes' then 'confirmed'
    when 'no'  then 'declined'
    else 'pending'
  end
  where id = v_guest.id;

  return json_build_object('success', true, 'guest_id', v_guest.id);
end;
$$;

-- register_rsvp_by_name: Registro general (sin token). Crea guest si no existe y hace upsert del RSVP.
create or replace function register_rsvp_by_name(
  p_slug      text,
  p_name      text,
  p_status    text,
  p_plus_ones integer default 0
)
returns json
language plpgsql
security definer
as $$
declare
  v_event    events%rowtype;
  v_guest_id uuid;
begin
  if p_status not in ('yes', 'no', 'maybe') then
    raise exception 'invalid_status';
  end if;

  if trim(p_name) = '' then
    raise exception 'invalid_name';
  end if;

  select * into v_event
  from events
  where slug = p_slug and is_published = true;

  if v_event.id is null then
    raise exception 'event_not_found';
  end if;

  -- Buscar invitado existente por nombre (case-insensitive)
  select id into v_guest_id
  from guests
  where event_id = v_event.id
    and lower(name) = lower(trim(p_name))
  limit 1;

  -- Si no existe, crear registro general
  if v_guest_id is null then
    insert into guests (event_id, name, group_name, status, max_plus_ones)
    values (v_event.id, trim(p_name), 'Registro General', 'pending', p_plus_ones)
    returning id into v_guest_id;
  end if;

  insert into rsvps (event_id, guest_id, status, plus_ones_confirmed, message)
  values (v_event.id, v_guest_id, p_status, p_plus_ones, 'Registro Directo')
  on conflict (guest_id) do update set
    status              = excluded.status,
    plus_ones_confirmed = excluded.plus_ones_confirmed;

  update guests
  set status = case p_status
    when 'yes' then 'confirmed'
    when 'no'  then 'declined'
    else 'pending'
  end
  where id = v_guest_id;

  return json_build_object('success', true, 'guest_id', v_guest_id);
end;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Permisos
-- ─────────────────────────────────────────────────────────────────────────────
grant execute on function get_guest_by_token(uuid, text)                              to anon, authenticated;
grant execute on function submit_rsvp_by_token(uuid, text, text, integer, text, text) to anon, authenticated;
grant execute on function register_rsvp_by_name(text, text, text, integer)            to anon, authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Indexes faltantes
--
-- Los FK no crean índices automáticamente en Postgres. Sin estos,
-- cada WHERE user_id=X o event_id=X hace un seq-scan completo.
-- ─────────────────────────────────────────────────────────────────────────────

-- events.user_id — todas las queries del dashboard filtran por usuario
create index if not exists idx_events_user_id
  on events (user_id);

-- guests.event_id — todas las queries de invitados filtran por evento
create index if not exists idx_guests_event_id
  on guests (event_id);

-- rsvps.event_id — RLS policy + queries de métricas
create index if not exists idx_rsvps_event_id
  on rsvps (event_id);

-- Índice funcional para búsqueda por nombre (register_rsvp_by_name usa lower(name))
create index if not exists idx_guests_lower_name_event
  on guests (event_id, lower(name));
