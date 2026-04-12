-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Linked to Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EVENTS
create table events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  title text not null,
  event_type text not null, -- wedding, xv, birthday, corporate
  date_time timestamp with time zone not null,
  venue_name text,
  venue_address text,
  maps_link text,
  dress_code text,
  rsvp_deadline timestamp with time zone,
  is_published boolean default false,
  theme_config jsonb default '{}'::jsonb, -- colors, fonts, etc.
  slug text unique, -- for public url
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GUESTS
create table guests (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  group_name text, -- family, friends, work
  guest_token uuid default uuid_generate_v4() unique not null,
  max_plus_ones integer default 0,
  status text default 'pending', -- pending, sent, viewed
  last_reminder_at timestamp with time zone,
  invitation_sent_at timestamp with time zone,
  checked_in_at timestamp with time zone,
  views_count integer default 0,
  table_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RSVPS
create table rsvps (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  guest_id uuid references guests(id) on delete cascade not null,
  status text not null, -- yes, no, maybe
  plus_ones_confirmed integer default 0,
  dietary_restrictions text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(guest_id) -- one rsvp per guest
);

-- RLS POLICIES

-- Profiles: Users can only see/edit their own profile
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Events: Users can CRUD their own events. Public can read published events via slug.
alter table events enable row level security;
create policy "Users can crud own events" on events for all using (auth.uid() = user_id);
create policy "Public can view published events" on events for select using (is_published = true);

-- Guests: Users can CRUD guests for their events.
-- Acceso anónimo via RPC SECURITY DEFINER (no política directa para anon).
alter table guests enable row level security;
create policy "Users can crud own event guests" on guests for all using (
  exists (select 1 from events where events.id = guests.event_id and events.user_id = auth.uid())
);

-- RSVPs: Users can view RSVPs for their events.
-- Inserción/actualización anónima via RPC SECURITY DEFINER (no política directa para anon).
alter table rsvps enable row level security;
create policy "Users can view own event rsvps" on rsvps for select using (
  exists (select 1 from events where events.id = rsvps.event_id and events.user_id = auth.uid())
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC FUNCTIONS — Acceso seguro para invitados anónimos
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

-- Permisos: anon y authenticated pueden llamar las funciones públicas
grant execute on function get_guest_by_token(uuid, text)                                     to anon, authenticated;
grant execute on function submit_rsvp_by_token(uuid, text, text, integer, text, text)        to anon, authenticated;
grant execute on function register_rsvp_by_name(text, text, text, integer)                   to anon, authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES
--
-- PostgreSQL crea índices automáticamente para PRIMARY KEY y UNIQUE,
-- pero NO para FOREIGN KEY. Sin estos índices, cada consulta que filtre
-- por estas columnas hace un seq-scan completo de la tabla — inaceptable
-- en producción con cientos de eventos o miles de invitados.
-- ─────────────────────────────────────────────────────────────────────────────

-- events.user_id — todas las queries del dashboard filtran por usuario
create index if not exists idx_events_user_id
  on events (user_id);

-- guests.event_id — todas las queries de invitados filtran por evento
create index if not exists idx_guests_event_id
  on guests (event_id);

-- rsvps.event_id — usado en la policy RLS y en queries de métricas
create index if not exists idx_rsvps_event_id
  on rsvps (event_id);

-- Índice funcional para búsqueda por nombre insensible a mayúsculas.
-- Usado por register_rsvp_by_name: lower(name) = lower(trim(p_name))
create index if not exists idx_guests_lower_name_event
  on guests (event_id, lower(name));
