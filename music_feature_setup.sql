-- =============================================================================
-- INVITTO — Configuración de Música de Fondo (Background Music)
-- Ejecutar este script en el SQL Editor de tu Dashboard de Supabase.
-- =============================================================================

-- 1. Registrar la feature background_music en el catálogo
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

-- 2. Asignar background_music exclusivamente a Premium y Concierge
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id
FROM plans p, features f
WHERE p.code IN ('premium', 'concierge')
  AND f.code = 'background_music'
ON CONFLICT DO NOTHING;

-- Garantizar que NO esté asignada a Clásico ni a Pro
DELETE FROM plan_features
WHERE feature_id IN (SELECT id FROM features WHERE code = 'background_music')
  AND plan_id IN (SELECT id FROM plans WHERE code IN ('clasico', 'pro'));

-- 3. Ampliar el bucket event-images para aceptar tipos MIME de audio (límite 5MB)
UPDATE storage.buckets
SET 
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/mp4', 'audio/x-m4a'
  ]
WHERE id = 'event-images';
