-- =============================================================================
-- INVITTO — planes_gating_fix.sql
-- Migración Completa y Autosuficiente de Planes, Features, Gating y Música
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

-- Habilitar extensión UUID si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TABLAS BASE (Crear con IF NOT EXISTS por si no existían en la DB)
-- ─────────────────────────────────────────────────────────────────────────────

-- Columnas en profiles
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS whatsapp_number text,
      ADD COLUMN IF NOT EXISTS plan_tier text NOT NULL DEFAULT 'clasico';
  END IF;
END $$;

-- Tabla: plans
CREATE TABLE IF NOT EXISTS plans (
  id           uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code         text UNIQUE NOT NULL,
  name         text NOT NULL,
  description  text,
  price_mxn    integer NOT NULL,
  billing_type text NOT NULL DEFAULT 'one_time',
  is_active    boolean DEFAULT true,
  created_at   timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Tabla: features
CREATE TABLE IF NOT EXISTS features (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  category    text,
  ui_group    text,
  is_active   boolean DEFAULT true
);

-- Tabla: plan_features
CREATE TABLE IF NOT EXISTS plan_features (
  id         uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id    uuid REFERENCES plans(id) ON DELETE CASCADE NOT NULL,
  feature_id uuid REFERENCES features(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE (plan_id, feature_id)
);

-- Tabla: event_subscriptions
CREATE TABLE IF NOT EXISTS event_subscriptions (
  id           uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id     uuid NOT NULL UNIQUE,
  plan_id      uuid REFERENCES plans(id) NOT NULL,
  status       text NOT NULL DEFAULT 'active',
  purchased_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at   timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. POLÍTICAS RLS Y PERMISOS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read plans" ON plans;
DROP POLICY IF EXISTS "Public read features" ON features;
DROP POLICY IF EXISTS "Public read plan_features" ON plan_features;

CREATE POLICY "Public read plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Public read features" ON features FOR SELECT USING (true);
CREATE POLICY "Public read plan_features" ON plan_features FOR SELECT USING (true);

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') THEN
    DROP POLICY IF EXISTS "Owners can view their event subscriptions" ON event_subscriptions;
    DROP POLICY IF EXISTS "Owners can insert their event subscriptions" ON event_subscriptions;
    DROP POLICY IF EXISTS "Owners can update their event subscriptions" ON event_subscriptions;

    CREATE POLICY "Owners can view their event subscriptions"
      ON event_subscriptions FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM events
          WHERE events.id = event_subscriptions.event_id
            AND events.user_id = auth.uid()
        )
      );

    CREATE POLICY "Owners can insert their event subscriptions"
      ON event_subscriptions FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM events
          WHERE events.id = event_subscriptions.event_id
            AND events.user_id = auth.uid()
        )
      );

    CREATE POLICY "Owners can update their event subscriptions"
      ON event_subscriptions FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM events
          WHERE events.id = event_subscriptions.event_id
            AND events.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. STORAGE: Habilitar audio (MP3, WAV, etc., hasta 5MB) en 'event-images'
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/mp4', 'audio/x-m4a'
  ]
WHERE id = 'event-images';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CATÁLOGO DE PLANES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO plans (code, name, description, price_mxn, billing_type) VALUES
  ('clasico', 'Clásica', 'Solo lo básico para tu evento', 499, 'one_time'),
  ('pro', 'Pro', 'Control total de invitados y pases', 1699, 'one_time'),
  ('premium', 'Premium', 'Diseño exclusivo por expertos y dominio propio', 2499, 'one_time'),
  ('concierge', 'Concierge', 'Servicio completo llave en mano con confirmación telefónica', 4499, 'one_time')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_mxn = EXCLUDED.price_mxn,
  is_active = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CATÁLOGO CANÓNICO DE FEATURES (17 features)
-- ─────────────────────────────────────────────────────────────────────────────
-- Normalizar códigos antiguos si ya existían
UPDATE features SET code = 'access_control' WHERE code = 'access_checkin';
UPDATE features SET code = 'qr_passes' WHERE code = 'guest_qr_pass';
UPDATE features SET is_active = false WHERE code IN ('basic_event_info', 'countdown', 'location_map', 'simple_rsvp');

INSERT INTO features (code, name, description, category, ui_group, is_active) VALUES
  -- Básicas (5)
  ('show_details', 'Información del Evento', 'Bloque de día, hora y dress code.', 'invitation', 'basic', true),
  ('show_countdown', 'Cuenta Regresiva', 'Temporizador interactivo hasta el evento.', 'invitation', 'basic', true),
  ('show_map', 'Ubicación con Mapa', 'Tarjeta interactiva con Google Maps y Waze.', 'invitation', 'basic', true),
  ('show_gallery', 'Galería de Fotos', 'Carrusel de fotografías del evento.', 'invitation', 'basic', true),
  ('show_whatsapp_rsvp', 'Confirmación WhatsApp Simple', 'Botón RSVP simple vía WhatsApp.', 'invitation', 'basic', true),

  -- Pro (8 adicionales -> 13 acumuladas)
  ('guest_dashboard', 'Lista de Invitados', 'Gestión en línea con tabla de control completa y mensajes.', 'management', 'pro', true),
  ('reminders_automatic', 'Recordatorios Automáticos', 'Notificaciones masivas y programadas vía WhatsApp.', 'management', 'pro', true),
  ('guest_import_excel', 'Importar desde Excel', 'Carga masiva de asistentes desde archivo Excel o CSV.', 'management', 'pro', true),
  ('metrics_dashboard', 'Dashboard de Métricas', 'Analíticas de confirmación, clics y tiempos de respuesta.', 'analytics', 'pro', true),
  ('qr_passes', 'Pases Digitales con QR', 'Pases individuales por invitado o familia con código QR.', 'security', 'pro', true),
  ('access_control', 'Control de Acceso (Check-in)', 'Herramienta de escaneo QR en puerta para staff.', 'security', 'pro', true),
  ('table_management', 'Control de Mesas', 'Organizador de acomodo de invitados por mesas.', 'management', 'pro', true),
  ('background_music', 'Música de Fondo', 'Reproducción automática de música de fondo (biblioteca, mp3 o enlace).', 'invitation', 'pro', true),

  -- Premium (2 adicionales -> 15 acumuladas)
  ('custom_domain', 'Dominio Propio', 'URL personalizada (.com) para tu invitación.', 'branding', 'premium', true),
  ('event_planning', 'Planeador de Eventos', 'Presupuesto, directorio de proveedores, contratos y Día B.', 'management', 'premium', true),

  -- Concierge (2 adicionales -> 17 acumuladas)
  ('smart_concierge', 'Asistente IA Concierge', 'Atención automática con IA y dudas frecuentes.', 'ai', 'concierge', true),
  ('confirma_whatsapp', 'Invitto Confirma WhatsApp', 'Servicio de confirmación telefónica y asistente de WhatsApp con seguimiento humano.', 'management', 'concierge', true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  ui_group = EXCLUDED.ui_group,
  is_active = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. RECONSTRUCCIÓN EXACTA DE plan_features (5 / 13 / 15 / 17)
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM plan_features;

-- A. Clásica (5 features básicas)
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id
FROM plans p, features f
WHERE p.code = 'clasico'
  AND f.code IN (
    'show_details',
    'show_countdown',
    'show_map',
    'show_gallery',
    'show_whatsapp_rsvp'
  );

-- B. Pro (13 features: 5 básicas + 8 de Pro)
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id
FROM plans p, features f
WHERE p.code = 'pro'
  AND f.code IN (
    'show_details',
    'show_countdown',
    'show_map',
    'show_gallery',
    'show_whatsapp_rsvp',
    'guest_dashboard',
    'reminders_automatic',
    'guest_import_excel',
    'metrics_dashboard',
    'qr_passes',
    'access_control',
    'table_management',
    'background_music'
  );

-- C. Premium (15 features: 13 de Pro + custom_domain + event_planning)
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id
FROM plans p, features f
WHERE p.code = 'premium'
  AND f.code IN (
    'show_details',
    'show_countdown',
    'show_map',
    'show_gallery',
    'show_whatsapp_rsvp',
    'guest_dashboard',
    'reminders_automatic',
    'guest_import_excel',
    'metrics_dashboard',
    'qr_passes',
    'access_control',
    'table_management',
    'background_music',
    'custom_domain',
    'event_planning'
  );

-- D. Concierge (17 features: 15 de Premium + smart_concierge + confirma_whatsapp)
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id
FROM plans p, features f
WHERE p.code = 'concierge'
  AND f.code IN (
    'show_details',
    'show_countdown',
    'show_map',
    'show_gallery',
    'show_whatsapp_rsvp',
    'guest_dashboard',
    'reminders_automatic',
    'guest_import_excel',
    'metrics_dashboard',
    'qr_passes',
    'access_control',
    'table_management',
    'background_music',
    'custom_domain',
    'event_planning',
    'smart_concierge',
    'confirma_whatsapp'
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. RPC CANÓNICO get_event_feature_access(p_event_id uuid)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_event_feature_access(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_plan_id   uuid;
  v_plan_code text;
  v_plan_name text;
  v_result    jsonb;
BEGIN
  -- Prioridad 1: event_subscriptions activa ligada al evento
  SELECT es.plan_id, pl.code, pl.name
  INTO   v_plan_id, v_plan_code, v_plan_name
  FROM   event_subscriptions es
  JOIN   plans pl ON pl.id = es.plan_id
  WHERE  es.event_id = p_event_id
    AND  es.status   = 'active'
  LIMIT 1;

  -- Prioridad 2: plan declarado en la fila del evento
  IF v_plan_id IS NULL AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'plan'
  ) THEN
    EXECUTE '
      SELECT pl.id, pl.code, pl.name
      FROM events e
      JOIN plans pl ON pl.code = CASE lower(coalesce(e.plan, ''clasico''))
                                   WHEN ''classic'' THEN ''clasico''
                                   WHEN ''personalizado'' THEN ''pro''
                                   WHEN ''personalized'' THEN ''pro''
                                   ELSE lower(coalesce(e.plan, ''clasico''))
                                 END
      WHERE e.id = $1
      LIMIT 1
    ' INTO v_plan_id, v_plan_code, v_plan_name USING p_event_id;
  END IF;

  -- Prioridad 3: plan_tier del perfil del creador del evento
  IF v_plan_id IS NULL THEN
    SELECT pl.id, pl.code, pl.name
    INTO   v_plan_id, v_plan_code, v_plan_name
    FROM   events e
    JOIN   profiles pr ON pr.id = e.user_id
    JOIN   plans pl ON pl.code = CASE lower(coalesce(pr.plan_tier, 'clasico'))
                                   WHEN 'classic' THEN 'clasico'
                                   WHEN 'personalizado' THEN 'pro'
                                   WHEN 'personalized' THEN 'pro'
                                   ELSE lower(coalesce(pr.plan_tier, 'clasico'))
                                 END
    WHERE  e.id = p_event_id
    LIMIT  1;
  END IF;

  -- Prioridad 4: Fallback a clásico
  IF v_plan_id IS NULL THEN
    SELECT id, code, name
    INTO   v_plan_id, v_plan_code, v_plan_name
    FROM   plans
    WHERE  code = 'clasico'
    LIMIT  1;
  END IF;

  -- Construir resultado
  SELECT jsonb_build_object(
    'plan', jsonb_build_object(
      'code', v_plan_code,
      'name', v_plan_name
    ),
    'features', jsonb_agg(
      jsonb_build_object(
        'code',         f.code,
        'name',         f.name,
        'ui_group',     f.ui_group,
        'status',       CASE
                          WHEN pf_active.feature_id IS NOT NULL THEN 'enabled'
                          ELSE 'locked'
                        END,
        'upgrade_plan', CASE
                          WHEN pf_active.feature_id IS NOT NULL THEN NULL
                          ELSE (
                            SELECT pl2.name
                            FROM   plan_features pf2
                            JOIN   plans pl2 ON pl2.id = pf2.plan_id
                            WHERE  pf2.feature_id = f.id
                            ORDER  BY pl2.price_mxn ASC
                            LIMIT  1
                          )
                        END
      )
      ORDER BY f.ui_group, f.code
    )
  )
  INTO v_result
  FROM features f
  LEFT JOIN plan_features pf_active
         ON pf_active.feature_id = f.id
        AND pf_active.plan_id    = v_plan_id
  WHERE f.is_active = true;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_event_feature_access(uuid) TO anon, authenticated;

-- Verificación de totales de features por plan (debe arrojar exactamente 5, 13, 15, 17)
SELECT p.code, p.name, count(pf.feature_id) AS total_features
FROM plans p
LEFT JOIN plan_features pf ON pf.plan_id = p.id
GROUP BY p.code, p.name, p.price_mxn
ORDER BY p.price_mxn ASC;
