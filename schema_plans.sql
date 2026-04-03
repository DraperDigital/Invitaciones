-- =============================================================================
-- INVITTO — Plan & Feature System
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES — agregar columnas que faltan
-- ─────────────────────────────────────────────────────────────────────────────
alter table profiles
  add column if not exists whatsapp_number text,
  add column if not exists plan_tier       text not null default 'clasico';


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PLANS — catálogo de planes disponibles
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists plans (
  id           uuid    default uuid_generate_v4() primary key,
  code         text    unique not null,          -- 'clasico' | 'premium' | 'pro'
  name         text    not null,
  description  text,
  price_mxn    integer not null,
  billing_type text    not null default 'one_time', -- 'one_time' | 'custom_quote'
  is_active    boolean default true,
  created_at   timestamp with time zone default timezone('utc', now()) not null
);

-- Seed
insert into plans (code, name, description, price_mxn, billing_type) values
  ('clasico',
   'Clásico',
   'Invitación digital elegante con todas las secciones esenciales del evento.',
   499,
   'one_time'),
  ('premium',
   'Premium',
   'Control total: lista de invitados, recordatorios automáticos y métricas.',
   1699,
   'one_time'),
  ('pro',
   'Personalizado',
   'Experiencia completa: QR, control de acceso, dominio propio y soporte 24/7.',
   2999,
   'one_time')
on conflict (code) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. FEATURES — catálogo de funcionalidades
--    Los códigos deben coincidir EXACTAMENTE con los usados en SettingsPage.tsx
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists features (
  id          uuid  default uuid_generate_v4() primary key,
  code        text  unique not null,
  name        text  not null,
  description text,
  category    text,   -- 'invitation' | 'management' | 'analytics' | 'ai' | 'security' | 'branding'
  ui_group    text,   -- 'basic' | 'premium' | 'pro'  — usado por el frontend para mostrar badge
  is_active   boolean default true
);

-- Seed — orden: básicas → premium → pro
insert into features (code, name, description, category, ui_group) values
  -- ── Clásico (básicas, siempre incluidas) ──────────────────────────────────
  ('show_details',
   'Información General',
   'Bloque de día, hora y dress code.',
   'invitation', 'basic'),

  ('show_countdown',
   'Cuenta Regresiva',
   'Temporizador interactivo hasta el evento.',
   'invitation', 'basic'),

  ('show_map',
   'Ubicación',
   'Tarjeta con dirección y enlace a Google Maps.',
   'invitation', 'basic'),

  ('show_gallery',
   'Galería Básica',
   'Carrusel de fotografías del evento.',
   'invitation', 'basic'),

  ('show_whatsapp_rsvp',
   'Confirmación WhatsApp',
   'Botón RSVP simple vía WhatsApp.',
   'invitation', 'basic'),

  -- ── Premium ───────────────────────────────────────────────────────────────
  ('guest_dashboard',
   'Lista de Invitados',
   'Gestión en línea con tabla de control completa.',
   'management', 'premium'),

  ('reminders_automatic',
   'Recordatorios Automáticos',
   'Notificaciones programadas vía WhatsApp.',
   'management', 'premium'),

  ('guest_import_excel',
   'Importar desde Excel',
   'Carga masiva de asistentes desde archivo .xlsx.',
   'management', 'premium'),

  ('metrics_dashboard',
   'Dashboard de Métricas',
   'Analíticas de clics, aperturas y conversión.',
   'analytics', 'premium'),

  -- ── Pro ───────────────────────────────────────────────────────────────────
  ('smart_concierge',
   'Asistente Automático',
   'Agente de IA que responde dudas de invitados automáticamente.',
   'ai', 'pro'),

  ('guest_qr_pass',
   'QR Invitados',
   'Pases de acceso digitales únicos por invitado.',
   'security', 'pro'),

  ('access_checkin',
   'Control de Acceso',
   'Herramienta de escaneo QR para el staff del evento.',
   'security', 'pro'),

  ('table_management',
   'Control de Mesas',
   'Organizador de acomodo por mesa con arrastrar y soltar.',
   'management', 'pro'),

  ('custom_domain',
   'Dominio Personalizado',
   'URL propia (ej. miboda.com) para la invitación.',
   'branding', 'pro')

on conflict (code) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PLAN_FEATURES — qué features desbloquea cada plan
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists plan_features (
  id         uuid default uuid_generate_v4() primary key,
  plan_id    uuid references plans(id)    on delete cascade not null,
  feature_id uuid references features(id) on delete cascade not null,
  unique (plan_id, feature_id)
);

-- Clásico → solo features básicas
insert into plan_features (plan_id, feature_id)
select p.id, f.id
from   plans p, features f
where  p.code = 'clasico'
  and  f.code in (
         'show_details', 'show_countdown', 'show_map',
         'show_gallery', 'show_whatsapp_rsvp'
       )
on conflict do nothing;

-- Premium → básicas + premium
insert into plan_features (plan_id, feature_id)
select p.id, f.id
from   plans p, features f
where  p.code = 'premium'
  and  f.code in (
         'show_details',       'show_countdown',     'show_map',
         'show_gallery',       'show_whatsapp_rsvp',
         'guest_dashboard',    'reminders_automatic',
         'guest_import_excel', 'metrics_dashboard'
       )
on conflict do nothing;

-- Pro → todas las features
insert into plan_features (plan_id, feature_id)
select p.id, f.id
from   plans p, features f
where  p.code = 'pro'
on conflict do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. EVENT_SUBSCRIPTIONS — plan activo por evento
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists event_subscriptions (
  id           uuid default uuid_generate_v4() primary key,
  event_id     uuid references events(id) on delete cascade not null unique,
  plan_id      uuid references plans(id)  not null,
  status       text not null default 'active', -- 'active' | 'expired' | 'cancelled'
  purchased_at timestamp with time zone default timezone('utc', now()) not null,
  updated_at   timestamp with time zone default timezone('utc', now()) not null
);

-- RLS
alter table event_subscriptions enable row level security;

drop policy if exists "Owners can view their event subscriptions"   on event_subscriptions;
drop policy if exists "Owners can insert their event subscriptions" on event_subscriptions;
drop policy if exists "Owners can update their event subscriptions" on event_subscriptions;

create policy "Owners can view their event subscriptions"
  on event_subscriptions for select
  using (
    exists (
      select 1 from events
      where events.id = event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Owners can insert their event subscriptions"
  on event_subscriptions for insert
  with check (
    exists (
      select 1 from events
      where events.id = event_id
        and events.user_id = auth.uid()
    )
  );

create policy "Owners can update their event subscriptions"
  on event_subscriptions for update
  using (
    exists (
      select 1 from events
      where events.id = event_id
        and events.user_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. RLS en tablas de referencia (lectura pública, sin datos sensibles)
-- ─────────────────────────────────────────────────────────────────────────────
alter table plans         enable row level security;
alter table features      enable row level security;
alter table plan_features enable row level security;

drop policy if exists "Public read plans"         on plans;
drop policy if exists "Public read features"      on features;
drop policy if exists "Public read plan_features" on plan_features;

create policy "Public read plans"         on plans         for select using (true);
create policy "Public read features"      on features      for select using (true);
create policy "Public read plan_features" on plan_features for select using (true);


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. RPC: get_event_feature_access(p_event_id uuid)
--
--    Retorna: {
--      plan: { code, name },
--      features: [{ code, name, ui_group, status: 'enabled'|'locked', upgrade_plan? }]
--    }
--
--    Llamada por useFeatureAccess.ts en cada página de gestión de evento.
--    Si el evento no tiene suscripción activa → asume plan 'clasico'.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function get_event_feature_access(p_event_id uuid)
returns jsonb
language plpgsql
security definer   -- corre con privilegios del owner, bypass RLS para lectura interna
stable             -- mismos inputs → mismo output dentro de la transacción (permite cacheo)
as $$
declare
  v_plan_id   uuid;
  v_plan_code text;
  v_plan_name text;
  v_result    jsonb;
begin
  -- Prioridad 1: suscripción activa ligada al evento (pagos procesados por checkout)
  select es.plan_id, pl.code, pl.name
  into   v_plan_id, v_plan_code, v_plan_name
  from   event_subscriptions es
  join   plans pl on pl.id = es.plan_id
  where  es.event_id = p_event_id
    and  es.status   = 'active'
  limit 1;

  -- Prioridad 2: plan_tier del perfil del dueño del evento
  -- Normaliza 'classic' → 'clasico' por si fue guardado con el código en inglés
  if v_plan_id is null then
    select pl.id, pl.code, pl.name
    into   v_plan_id, v_plan_code, v_plan_name
    from   events e
    join   profiles pr on pr.id = e.user_id
    join   plans pl    on pl.code = case coalesce(pr.plan_tier, 'clasico')
                                      when 'classic'      then 'clasico'
                                      when 'personalizado' then 'pro'
                                      when 'personalized'  then 'pro'
                                      else coalesce(pr.plan_tier, 'clasico')
                                    end
    where  e.id = p_event_id
    limit  1;
  end if;

  -- Prioridad 3: fallback definitivo a clásico
  if v_plan_id is null then
    select id, code, name
    into   v_plan_id, v_plan_code, v_plan_name
    from   plans
    where  code = 'clasico'
    limit  1;
  end if;

  -- Construir lista de features con status enabled / locked
  select jsonb_build_object(
    'plan', jsonb_build_object(
      'code', v_plan_code,
      'name', v_plan_name
    ),
    'features', jsonb_agg(
      jsonb_build_object(
        'code',         f.code,
        'name',         f.name,
        'ui_group',     f.ui_group,
        'status',       case
                          when pf_active.feature_id is not null then 'enabled'
                          else 'locked'
                        end,
        -- Plan mínimo que desbloquea esta feature (para el botón "Upgrade")
        'upgrade_plan', case
                          when pf_active.feature_id is not null then null
                          else (
                            select pl2.code
                            from   plan_features pf2
                            join   plans pl2 on pl2.id = pf2.plan_id
                            where  pf2.feature_id = f.id
                            order  by pl2.price_mxn asc
                            limit  1
                          )
                        end
      )
      order by f.ui_group, f.code   -- orden determinista
    )
  )
  into v_result
  from features f
  -- join solo si el plan activo incluye la feature
  left join plan_features pf_active
         on pf_active.feature_id = f.id
        and pf_active.plan_id    = v_plan_id
  where f.is_active = true;

  return v_result;
end;
$$;

-- Permisos: cualquier usuario autenticado o anónimo puede llamar la función
-- (la seguridad real está en que la función no expone datos sensibles)
grant execute on function get_event_feature_access(uuid) to anon, authenticated;
