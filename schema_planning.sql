-- =============================================================================
-- INVITTO — Módulo Planeación v2 (Premium del paquete Pro)
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql y schema_plans.sql
--
-- Modelo:   RUBRO (lo estimado)
--             └─ varias COTIZACIONES (una por proveedor)
--                  └─ la elegida = CONTRATO  (status contratado)
--                       └─ PAGOS (anticipo → liquidación, con fecha y estado)
--           TASKS (pendientes, ligados a rubro/cotización) · DAY_OF (carpeta día B)
--
--   · Todo cuelga del EVENTO (events.id). Mismo patrón RLS/índices que guests.
--   · El cliente usa el schema 'invitto' (lib/supabase.ts). Igual que schema.sql.
--   · Montos en MXN, numeric(12,2).
-- =============================================================================

set search_path = invitto, public;

-- Usamos gen_random_uuid() (nativa de Postgres) en vez de gen_random_uuid()
-- (extensión uuid-ossp) para no depender de dónde esté instalada la extensión.
-- NOTA: este script es 100% aditivo. No borra ninguna tabla ni dato existente.
-- (Si en algún momento corriste una v1 de prueba con tablas budget_categories /
--  expenses, puedes borrarlas tú a mano aparte; aquí ya no se tocan.)


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. BUDGET_RUBROS — los rubros (lo estimado). Precargados por el asistente.
--    location: 'iglesia' | 'recepcion' | 'ambos' | null  (ej. flores en ambos)
--    is_external: true para lo ya resuelto fuera del módulo (Invitaciones = Invitto)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists budget_rubros (
  id               uuid default gen_random_uuid() primary key,
  event_id         text references events(id) on delete cascade not null,
  name             text not null,
  location         text,
  estimated_amount numeric(12,2) not null default 0,
  benchmark_pct    integer default 0,         -- % de referencia del total (guía / media)
  is_external      boolean default false,
  sort_order       integer default 0,
  created_at       timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. VENDORS — directorio de proveedores (contacto). El estado vive por cotización.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists vendors (
  id            uuid default gen_random_uuid() primary key,
  event_id      text references events(id) on delete cascade not null,
  name          text not null,
  category      text,
  contact_name  text,
  phone         text,
  email         text,
  website       text,
  notes         text,
  created_at    timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. QUOTES — cotizaciones. Varias por rubro, de distintos proveedores.
--    status: 'contactado' | 'cotizado' | 'contratado' | 'descartado'
--    is_chosen: la cotización elegida del rubro (= el contrato).
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists quotes (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id)        on delete cascade not null,
  rubro_id    uuid references budget_rubros(id) on delete cascade not null,
  vendor_id   uuid references vendors(id)       on delete cascade not null,
  amount      numeric(12,2) not null default 0,
  status      text not null default 'cotizado',
  is_chosen   boolean default false,
  quoted_on   date,
  notes       text,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. VENDOR_PAYMENTS — pagos del contrato (anticipo, adelanto, liquidación).
--    status: 'scheduled' | 'paid' | 'overdue'
--    due_date = cuándo toca → recordatorio. paid_on = cuándo se pagó.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists vendor_payments (
  id               uuid default gen_random_uuid() primary key,
  event_id         text references events(id)  on delete cascade not null,
  quote_id         uuid references quotes(id)  on delete cascade not null,
  vendor_id        uuid references vendors(id) on delete set null,
  label            text,
  amount           numeric(12,2) not null,
  due_date         date,
  paid_on          date,
  status           text not null default 'scheduled',
  reminder_sent_at timestamp with time zone,
  created_at       timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. TASKS — pendientes. Pueden colgar de un rubro/cotización (pipeline) o ser libres.
--    phase: '3_months' | '1_month' | 'week_of' | 'day_of' | 'after'
--    source: 'template' | 'pipeline' | 'custom'
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists tasks (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id)        on delete cascade not null,
  title       text not null,
  phase       text,
  due_date    date,
  is_done     boolean default false,
  done_at     timestamp with time zone,
  rubro_id    uuid references budget_rubros(id) on delete set null,
  quote_id    uuid references quotes(id)        on delete set null,
  source      text default 'custom',
  sort_order  integer default 0,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. DAY_OF_ITEMS — la "carpeta" del día B (lo mejor de Yes Planner).
--    section: 'montaje' | 'ceremonia' | 'contactos' | 'general'
--    time: hora libre ('16:30'); vendor_id opcional para ligar a un proveedor.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists day_of_items (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id)  on delete cascade not null,
  section     text not null default 'general',
  title       text not null,
  time        text,
  detail      text,
  vendor_id   uuid references vendors(id) on delete set null,
  is_done     boolean default false,
  sort_order  integer default 0,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6b. NOTES — notas libres de la planeación (una lista por evento).
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists notes (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id) on delete cascade not null,
  title       text,
  body        text,
  sort_order  integer default 0,
  created_at  timestamp with time zone default timezone('utc', now()) not null,
  updated_at  timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6c. GIFTS — agradecimientos (quién regaló qué y si ya le diste las gracias).
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists gifts (
  id          uuid default gen_random_uuid() primary key,
  event_id    text references events(id) on delete cascade not null,
  giver_name  text not null,
  gift        text,
  amount      numeric(12,2),
  thanked     boolean default false,
  thanked_on  date,
  created_at  timestamp with time zone default timezone('utc', now()) not null
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. FEATURE GATING — Planeación como feature del plan Pro
-- ─────────────────────────────────────────────────────────────────────────────
-- Envuelto en un DO con manejo de excepción: si las tablas features/plans no
-- existen o tienen otras columnas, se OMITE el gating con un aviso en vez de
-- revertir toda la migración. Así las tablas y la función siempre se crean.
do $$
begin
  insert into features (code, name, description, category, ui_group) values
    ('event_planning',
     'Planeación del Evento',
     'Presupuesto por rubros, cotizaciones y contratos, pagos y carpeta del día, conectados a tu evento.',
     'management', 'pro')
  on conflict (code) do nothing;

  insert into plan_features (plan_id, feature_id)
  select p.id, f.id from plans p, features f
  where  p.code = 'pro' and f.code = 'event_planning'
  on conflict do nothing;
exception when others then
  raise notice 'Gating de event_planning omitido (features/plans no disponibles): %', sqlerrm;
end $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. RLS — ownership por evento (idéntico a guests / rsvps)
-- ─────────────────────────────────────────────────────────────────────────────
alter table budget_rubros   enable row level security;
alter table vendors         enable row level security;
alter table quotes          enable row level security;
alter table vendor_payments enable row level security;
alter table tasks           enable row level security;
alter table day_of_items    enable row level security;
alter table notes           enable row level security;
alter table gifts           enable row level security;

create policy "Owner crud budget_rubros" on budget_rubros for all using (
  exists (select 1 from events e where e.id = budget_rubros.event_id and e.user_id = auth.uid()));
create policy "Owner crud vendors" on vendors for all using (
  exists (select 1 from events e where e.id = vendors.event_id and e.user_id = auth.uid()));
create policy "Owner crud quotes" on quotes for all using (
  exists (select 1 from events e where e.id = quotes.event_id and e.user_id = auth.uid()));
create policy "Owner crud vendor_payments" on vendor_payments for all using (
  exists (select 1 from events e where e.id = vendor_payments.event_id and e.user_id = auth.uid()));
create policy "Owner crud tasks" on tasks for all using (
  exists (select 1 from events e where e.id = tasks.event_id and e.user_id = auth.uid()));
create policy "Owner crud day_of_items" on day_of_items for all using (
  exists (select 1 from events e where e.id = day_of_items.event_id and e.user_id = auth.uid()));
create policy "Owner crud notes" on notes for all using (
  exists (select 1 from events e where e.id = notes.event_id and e.user_id = auth.uid()));
create policy "Owner crud gifts" on gifts for all using (
  exists (select 1 from events e where e.id = gifts.event_id and e.user_id = auth.uid()));


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. ÍNDICES — uno por FK (todas las queries filtran por event_id)
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_rubros_event        on budget_rubros (event_id);
create index if not exists idx_vendors_event        on vendors (event_id);
create index if not exists idx_quotes_event         on quotes (event_id);
create index if not exists idx_quotes_rubro         on quotes (rubro_id);
create index if not exists idx_quotes_vendor        on quotes (vendor_id);
create index if not exists idx_payments_event       on vendor_payments (event_id);
create index if not exists idx_payments_quote       on vendor_payments (quote_id);
create index if not exists idx_payments_due         on vendor_payments (event_id, due_date);
create index if not exists idx_tasks_event          on tasks (event_id);
create index if not exists idx_tasks_phase          on tasks (event_id, phase);
create index if not exists idx_dayof_event          on day_of_items (event_id);
create index if not exists idx_notes_event          on notes (event_id);
create index if not exists idx_gifts_event          on gifts (event_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 10. RPC: seed_planning_defaults(p_event_id)
--     El arranque con trabajo hecho: precarga los rubros que usa una boda en MX,
--     un checklist base por fase, y el esqueleto de la carpeta del día B.
--     Idempotente (no re-siembra si ya hay rubros).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function seed_planning_defaults(p_event_id text)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_owner uuid;
  v_date  timestamptz;
  v_exists integer;
begin
  select e.user_id, e.date_time into v_owner, v_date from events e where e.id = p_event_id;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'not_authorized';
  end if;

  select count(*) into v_exists from budget_rubros where event_id = p_event_id;
  if v_exists > 0 then
    return jsonb_build_object('seeded', false, 'reason', 'already_has_data');
  end if;

  -- Rubros (taxonomía de boda MX; venue se desdobla en iglesia y recepción).
  -- benchmark_pct = % de referencia del presupuesto total (calibrado para MX; suma 100).
  insert into budget_rubros (event_id, name, location, benchmark_pct, is_external, sort_order) values
    (p_event_id, 'Banquete',            null,        30, false, 1),
    (p_event_id, 'Venue — Salón',       'recepcion', 12, false, 2),
    (p_event_id, 'Fotografía y video',  null,         9, false, 3),
    (p_event_id, 'Música',              'ambos',      8, false, 4),
    (p_event_id, 'Bebidas',             null,         6, false, 5),
    (p_event_id, 'Flores',              'ambos',      6, false, 6),
    (p_event_id, 'Decoración',          null,         6, false, 7),
    (p_event_id, 'Imprevistos',         null,         5, false, 8),
    (p_event_id, 'Barras',              null,         4, false, 9),
    (p_event_id, 'Mobiliario',          null,         4, false, 10),
    (p_event_id, 'Venue — Iglesia',     'iglesia',    3, false, 11),
    (p_event_id, 'Iluminación',         null,         3, false, 12),
    (p_event_id, 'Souvenirs',           null,         2, false, 13),
    (p_event_id, 'Extras / servicios',  null,         2, false, 14),
    (p_event_id, 'Invitaciones',        null,         0, true,  15);

  -- Checklist base: la fecha de cada tarea se calcula sola desde el día del evento.
  -- (v_date null → due_date null; no rompe)
  insert into tasks (event_id, title, phase, due_date, source, sort_order) values
    (p_event_id, 'Definir presupuesto total y lista de invitados', '3_months', (v_date - interval '12 months')::date, 'template', 1),
    (p_event_id, 'Reservar iglesia y salón (fechas)',              '3_months', (v_date - interval '12 months')::date, 'template', 2),
    (p_event_id, 'Pedir cotizaciones de banquete y foto',          '3_months', (v_date - interval '11 months')::date, 'template', 3),
    (p_event_id, 'Contratar música para ceremonia y fiesta',       '3_months', (v_date - interval '10 months')::date, 'template', 4),
    (p_event_id, 'Comprar los anillos',                            '3_months', (v_date - interval '9 months')::date,  'template', 5),
    (p_event_id, 'Planear la luna de miel y revisar pasaportes',   '3_months', (v_date - interval '8 months')::date,  'template', 6),
    (p_event_id, 'Prueba de menú con el banquete',                 '1_month',  (v_date - interval '3 months')::date,  'template', 7),
    (p_event_id, 'Enviar invitaciones digitales',                  '1_month',  (v_date - interval '2 months')::date,  'template', 8),
    (p_event_id, 'Prueba de peluquería y maquillaje',              '1_month',  (v_date - interval '45 days')::date,   'template', 9),
    (p_event_id, 'Cerrar acomodo de mesas',                        '1_month',  (v_date - interval '1 month')::date,   'template', 10),
    (p_event_id, 'Liquidar anticipos pendientes',                  '1_month',  (v_date - interval '1 month')::date,   'template', 11),
    (p_event_id, 'Elegir las canciones clave',                     'week_of',  (v_date - interval '10 days')::date,   'template', 12),
    (p_event_id, 'Confirmar conteo final y menús con banquete',    'week_of',  (v_date - interval '7 days')::date,    'template', 13),
    (p_event_id, 'Enviar horario de montaje a proveedores',        'week_of',  (v_date - interval '5 days')::date,    'template', 14),
    (p_event_id, 'Preparar sobres de pagos finales',               'week_of',  (v_date - interval '3 days')::date,    'template', 15),
    (p_event_id, 'Entregar itinerario a staff el día del evento',  'day_of',   v_date::date,                          'template', 16),
    (p_event_id, 'Devolver materiales y mobiliario rentado',       'after',    (v_date + interval '2 days')::date,    'template', 17),
    (p_event_id, 'Pagar saldos finales a proveedores',             'after',    (v_date + interval '3 days')::date,    'template', 18),
    (p_event_id, 'Enviar agradecimientos a los invitados',         'after',    (v_date + interval '2 weeks')::date,   'template', 19),
    (p_event_id, 'Compartir fotos con proveedores y familia',      'after',    (v_date + interval '3 weeks')::date,   'template', 20),
    (p_event_id, 'Dejar reseñas a tus proveedores',                'after',    (v_date + interval '1 month')::date,   'template', 21);

  -- Itinerario del día B (granular: preparativos personales + montaje + ceremonia + fiesta)
  insert into day_of_items (event_id, section, title, time, sort_order) values
    (p_event_id, 'preparativos', 'Despertar y desayunar',           '08:00', 1),
    (p_event_id, 'preparativos', 'Peluquería y maquillaje',         '09:30', 2),
    (p_event_id, 'preparativos', 'Vestirse',                        '12:00', 3),
    (p_event_id, 'preparativos', 'Llega el fotógrafo (getting ready)','13:00', 4),
    (p_event_id, 'preparativos', 'Fotos previas y con la familia',  '13:30', 5),
    (p_event_id, 'montaje',   'Llegada de flores a iglesia',        '09:00', 1),
    (p_event_id, 'montaje',   'Montaje de salón y mobiliario',      '11:00', 2),
    (p_event_id, 'montaje',   'Prueba de sonido e iluminación',     '15:00', 3),
    (p_event_id, 'ceremonia', 'Llegan los invitados',               '16:30', 1),
    (p_event_id, 'ceremonia', 'Entrada del cortejo',                '17:00', 2),
    (p_event_id, 'ceremonia', 'Ceremonia religiosa',                '17:15', 3),
    (p_event_id, 'ceremonia', 'Salida, felicitaciones y cóctel',    '18:00', 4),
    (p_event_id, 'general',   'Entrada triunfal a la recepción',    '19:15', 1),
    (p_event_id, 'general',   'Primer baile',                       '19:35', 2),
    (p_event_id, 'general',   'Banquete',                           '20:00', 3),
    (p_event_id, 'general',   'Brindis',                            '20:40', 4),
    (p_event_id, 'general',   'Fiesta',                             '21:20', 5),
    (p_event_id, 'general',   'Partir el pastel',                   '22:30', 6),
    (p_event_id, 'general',   'Cierre y gran salida',               '23:30', 7);

  return jsonb_build_object('seeded', true);
end;
$$;

grant execute on function seed_planning_defaults(text) to authenticated;
