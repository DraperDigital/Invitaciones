-- =============================================================================
-- INVITTO — Configuración de Música de Fondo (Background Music)
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

-- 1. Ampliar el bucket event-images para aceptar archivos de audio (límite 5MB)
UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/mp4', 'audio/x-m4a'
  ]
WHERE id = 'event-images';

-- 2. Registrar en catálogo de features (solo si la tabla 'features' existe en tu base de datos)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'features') THEN
    INSERT INTO features (code, name, description, category, ui_group)
    VALUES (
      'background_music',
      'Música de Fondo',
      'Reproduce música de fondo automáticamente en la invitación (Biblioteca, MP3 o enlace).',
      'invitation',
      'premium'
    )
    ON CONFLICT (code) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      category = EXCLUDED.category,
      ui_group = EXCLUDED.ui_group,
      is_active = true;
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plan_features') THEN
    INSERT INTO plan_features (plan_id, feature_id)
    SELECT p.id, f.id
    FROM plans p, features f
    WHERE p.code IN ('premium', 'concierge')
      AND f.code = 'background_music'
    ON CONFLICT DO NOTHING;

    DELETE FROM plan_features
    WHERE feature_id IN (SELECT id FROM features WHERE code = 'background_music')
      AND plan_id IN (SELECT id FROM plans WHERE code IN ('clasico', 'pro'));
  END IF;
END $$;
