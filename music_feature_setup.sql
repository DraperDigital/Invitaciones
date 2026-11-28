-- =============================================================================
-- INVITTO — Configuración de Música de Fondo (Background Music)
-- Ejecutar en Supabase SQL Editor
-- (Nota: planes_gating_fix.sql ya incluye todo esto y la configuración completa de planes)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ampliar el bucket event-images para aceptar archivos de audio (límite 5MB)
UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/mp4', 'audio/x-m4a'
  ]
WHERE id = 'event-images';

-- 2. Asegurar que la tabla features exista
CREATE TABLE IF NOT EXISTS features (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  category    text,
  ui_group    text,
  is_active   boolean DEFAULT true
);

-- 3. Registrar background_music en features
INSERT INTO features (code, name, description, category, ui_group)
VALUES (
  'background_music',
  'Música de Fondo',
  'Reproduce música de fondo automáticamente en la invitación (Biblioteca, MP3 o enlace).',
  'invitation',
  'pro'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  ui_group = EXCLUDED.ui_group,
  is_active = true;

-- 4. Asociar a planes si plan_features y plans existen
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plan_features') 
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plans') THEN
    
    INSERT INTO plan_features (plan_id, feature_id)
    SELECT p.id, f.id
    FROM plans p, features f
    WHERE p.code IN ('pro', 'premium', 'concierge')
      AND f.code = 'background_music'
    ON CONFLICT DO NOTHING;

    DELETE FROM plan_features
    WHERE feature_id IN (SELECT id FROM features WHERE code = 'background_music')
      AND plan_id IN (SELECT id FROM plans WHERE code IN ('clasico'));
  END IF;
END $$;
