-- =============================================================================
-- INVITTO — Migración: Cupones Data-Driven (allowed_plans text[])
-- Ejecutar en el SQL Editor del self-hosted (supabase.drapersystems.online)
-- IMPORTANTE: Ejecutar ANTES de reiniciar/redesplegar la función apply-coupon
-- =============================================================================

SET search_path = invitto, public;

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 1: Agregar columna allowed_plans text[] de forma defensiva
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = current_schema() AND table_name = 'coupons' AND column_name = 'allowed_plans'
  ) THEN
    ALTER TABLE coupons ADD COLUMN allowed_plans text[];
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 2: Migrar cupones existentes a allowed_plans
-- ─────────────────────────────────────────────────────────────────────────────

-- 2.1 INVITTO26 solo es válido para Clásica ('clasico') y Diseño Pro ('premium')
UPDATE coupons 
SET allowed_plans = ARRAY['clasico', 'premium']
WHERE code = 'INVITTO26';

-- 2.2 Migrar cupones que tengan plan_id individual a su equivalente en array
UPDATE coupons 
SET allowed_plans = ARRAY[lower(trim(plan_id))]
WHERE (allowed_plans IS NULL OR cardinality(allowed_plans) = 0)
  AND plan_id IS NOT NULL 
  AND trim(plan_id) != '';

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 3: Crear / Actualizar cupón SOPHIAHUETT (100% gratis, 1 uso, Clásica + Pro)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO coupons (
  code,
  active,
  discount_percent,
  override_price,
  allowed_plans,
  plan_id,
  max_uses,
  current_uses
)
VALUES (
  'SOPHIAHUETT',
  true,
  100,
  NULL,
  ARRAY['clasico', 'pro'],
  '',
  1,
  0
)
ON CONFLICT (code) DO UPDATE SET
  active = true,
  discount_percent = 100,
  override_price = NULL,
  allowed_plans = ARRAY['clasico', 'pro'],
  plan_id = '',
  max_uses = 1,
  current_uses = 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 4: Verificación
-- ─────────────────────────────────────────────────────────────────────────────
SELECT 
  code, 
  active, 
  discount_percent, 
  override_price, 
  allowed_plans, 
  plan_id, 
  max_uses, 
  current_uses 
FROM coupons 
WHERE code IN ('INVITTO26', 'SOPHIAHUETT');
