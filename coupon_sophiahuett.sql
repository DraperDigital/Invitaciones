-- =============================================================================
-- INVITTO — Cupón SOPHIAHUETT (100% gratis · 1 solo uso · Clásica y Pro)
-- Ejecutar en el SQL Editor del self-hosted (supabase.drapersystems.online)
-- IMPORTANTE: Ejecutar DESPUÉS de haber desplegado la función apply-coupon
-- =============================================================================

-- Fijar search_path para soportar esquema invitto y public
SET search_path = invitto, public;

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 0: Diagnóstico y verificación defensiva de columnas en 'coupons'
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Agregar columna active si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = current_schema() AND table_name = 'coupons' AND column_name = 'active'
  ) THEN
    ALTER TABLE coupons ADD COLUMN active boolean DEFAULT true NOT NULL;
  END IF;

  -- Agregar columna expires_at si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = current_schema() AND table_name = 'coupons' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE coupons ADD COLUMN expires_at timestamp with time zone;
  END IF;

  -- Agregar columna plan_id si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = current_schema() AND table_name = 'coupons' AND column_name = 'plan_id'
  ) THEN
    ALTER TABLE coupons ADD COLUMN plan_id text DEFAULT '';
  END IF;

  -- Agregar columna override_price si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = current_schema() AND table_name = 'coupons' AND column_name = 'override_price'
  ) THEN
    ALTER TABLE coupons ADD COLUMN override_price numeric(10,2);
  END IF;

  -- Agregar columna discount_percent si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = current_schema() AND table_name = 'coupons' AND column_name = 'discount_percent'
  ) THEN
    ALTER TABLE coupons ADD COLUMN discount_percent numeric(5,2);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 1: Inserción / Actualización del cupón SOPHIAHUETT
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO coupons (
  code,
  active,
  discount_percent,
  override_price,
  plan_id,
  max_uses,
  current_uses
)
VALUES (
  'SOPHIAHUETT',
  true,
  100,
  NULL,
  '',
  1,
  0
)
ON CONFLICT (code) DO UPDATE SET
  active = true,
  discount_percent = 100,
  override_price = NULL,
  plan_id = '',
  max_uses = 1,
  current_uses = 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- PASO 2: Confirmación
-- ─────────────────────────────────────────────────────────────────────────────
SELECT 
  code, 
  active, 
  discount_percent, 
  override_price, 
  plan_id, 
  max_uses, 
  current_uses 
FROM coupons 
WHERE code = 'SOPHIAHUETT';
