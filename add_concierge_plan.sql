-- Agregar el Plan Concierge al catálogo
INSERT INTO plans (code, name, description, price_mxn, billing_type) 
VALUES (
  'concierge', 
  'Plan Concierge', 
  'Todo lo de Pro + Gestión total de invitados, confirmaciones vía WhatsApp profesional y reportes de asistencia personalizados.', 
  3999, 
  'one_time'
)
ON CONFLICT (code) DO UPDATE SET 
  price_mxn = EXCLUDED.price_mxn,
  description = EXCLUDED.description;

-- Desbloquear todas las features para el plan Concierge
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id
FROM plans p, features f
WHERE p.code = 'concierge'
ON CONFLICT DO NOTHING;
