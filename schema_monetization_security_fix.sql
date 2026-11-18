-- =============================================================================
-- INVITTO — Parche de Seguridad: Monetización, Suscripciones y Cupones
-- Ejecutar en el SQL Editor de tu Supabase self-hosted (supabase.drapersystems.online)
-- =============================================================================

-- Asegurar que apunte al esquema configurado
SET search_path = invitto, public;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Cerrar permisos de escritura en EVENT_SUBSCRIPTIONS para usuarios
--    Los usuarios SOLO deben poder consultar (SELECT) su suscripción.
--    INSERT / UPDATE / DELETE quedan restringidos exclusivamente al backend (service_role).
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE IF EXISTS event_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can insert their event subscriptions" ON event_subscriptions;
DROP POLICY IF EXISTS "Owners can update their event subscriptions" ON event_subscriptions;

-- Garantizar que solo puedan leer sus suscripciones
DROP POLICY IF EXISTS "Owners can view their event subscriptions" ON event_subscriptions;
CREATE POLICY "Owners can view their event subscriptions"
  ON event_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_subscriptions.event_id
        AND events.user_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Proteger la tabla COUPONS y la función INCREMENT_COUPON_USE
--    Nadie en el frontend (anon ni authenticated) debe poder ver los cupones
--    ni alterar su contador. Solo la Edge Function con service_role.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE IF EXISTS coupons ENABLE ROW LEVEL SECURITY;

-- Eliminar lectura pública de cupones
DROP POLICY IF EXISTS "Coupons are viewable by everyone." ON coupons;
DROP POLICY IF EXISTS "Coupons viewable by everyone" ON coupons;
DROP POLICY IF EXISTS "Public read coupons" ON coupons;

-- Revocar permisos de ejecución a anon y authenticated sobre increment_coupon_use
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'increment_coupon_use'
  ) THEN
    REVOKE ALL ON FUNCTION increment_coupon_use(text) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION increment_coupon_use(text) TO service_role;
  END IF;
END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Trigger: Proteger PROFILES.PLAN_TIER contra modificaciones del cliente
--    Un usuario autenticado puede actualizar su nombre, teléfono, etc.,
--    pero NUNCA su plan_tier directamente. Solo service_role puede cambiarlo.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION protect_profile_plan_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la llamada NO proviene del service_role / superusuario
  IF (coalesce(auth.role(), '') != 'service_role' AND current_user NOT IN ('postgres', 'supabase_admin')) THEN
    IF NEW.plan_tier IS DISTINCT FROM OLD.plan_tier THEN
      RAISE EXCEPTION 'Operación no permitida: plan_tier no puede ser modificado por el cliente.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_plan_tier ON profiles;
CREATE TRIGGER trg_protect_profile_plan_tier
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_plan_tier();


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Trigger: Proteger EVENTS.IS_PUBLISHED y EVENTS.THEME_CONFIG.PLAN_TIER
--    Un evento no puede publicarse ni asignarse plan de pago a menos que:
--    a) La actualización venga de service_role (webhook de Stripe / Edge Function de cupón)
--    b) Exista una suscripción activa verificada en event_subscriptions.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION protect_event_publication()
RETURNS TRIGGER AS $$
DECLARE
  v_is_service_role boolean;
  v_has_active_sub  boolean;
BEGIN
  v_is_service_role := (coalesce(auth.role(), '') = 'service_role' OR current_user IN ('postgres', 'supabase_admin'));

  -- Si proviene de service_role (webhook Stripe / Edge function), permitir cualquier cambio
  IF v_is_service_role THEN
    RETURN NEW;
  END IF;

  -- 1. Si el cliente intenta activar is_published = true
  IF NEW.is_published = true AND (OLD.is_published IS DISTINCT FROM true) THEN
    SELECT EXISTS (
      SELECT 1 FROM event_subscriptions
      WHERE event_id = NEW.id
        AND status = 'active'
    ) INTO v_has_active_sub;

    IF NOT v_has_active_sub THEN
      RAISE EXCEPTION 'No se puede publicar el evento sin una suscripción activa pagada.';
    END IF;
  END IF;

  -- 2. Si el cliente intenta modificar el plan_tier dentro de theme_config
  IF (NEW.theme_config->>'plan_tier') IS DISTINCT FROM (OLD.theme_config->>'plan_tier') THEN
    SELECT EXISTS (
      SELECT 1 FROM event_subscriptions es
      JOIN plans p ON p.id = es.plan_id
      WHERE es.event_id = NEW.id
        AND es.status = 'active'
        AND p.code = NEW.theme_config->>'plan_tier'
    ) INTO v_has_active_sub;

    IF NOT v_has_active_sub THEN
      RAISE EXCEPTION 'No se puede asignar un plan sin una suscripción correspondiente activa.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_event_publication ON events;
CREATE TRIGGER trg_protect_event_publication
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION protect_event_publication();
