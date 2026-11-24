-- Migración aditiva para Invitto Confirma (Asistente de Confirmación por WhatsApp)
-- 100% Aditiva e idempotente

-- 1. Campo source en rsvps ('form' | 'whatsapp' | 'manual')
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS source text DEFAULT 'form';
COMMENT ON COLUMN rsvps.source IS 'Procedencia de la confirmación: form | whatsapp | manual';

CREATE INDEX IF NOT EXISTS idx_rsvps_source ON rsvps(source);

-- 2. Configuración del servicio Confirma por evento
CREATE TABLE IF NOT EXISTS confirma_settings (
    event_id text PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
    enabled boolean NOT NULL DEFAULT false,
    business_number text NOT NULL DEFAULT '',
    quota_contacts integer NOT NULL DEFAULT 200,
    used_conversations integer NOT NULL DEFAULT 0,
    activated_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz
);

COMMENT ON TABLE confirma_settings IS 'Configuración y estado del bot de confirmación WhatsApp por evento';

-- 3. Log de conversación de WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id text NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id uuid REFERENCES guests(id) ON DELETE SET NULL,
    direction text NOT NULL CHECK (direction IN ('in', 'out')),
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE whatsapp_messages IS 'Registro de mensajes entrantes y salientes del bot de confirmación';

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_event_id ON whatsapp_messages(event_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_guest_id ON whatsapp_messages(guest_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at DESC);

-- 4. RLS y Políticas de Seguridad
ALTER TABLE confirma_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para confirma_settings
-- Lectura pública para saber si el botón de WhatsApp debe mostrarse en la invitación
DROP POLICY IF EXISTS "Public read confirma_settings for invitations" ON confirma_settings;
CREATE POLICY "Public read confirma_settings for invitations" 
    ON confirma_settings FOR SELECT 
    USING (true);

-- Gestión solo para el dueño del evento
DROP POLICY IF EXISTS "Event owners can insert confirma_settings" ON confirma_settings;
CREATE POLICY "Event owners can insert confirma_settings" 
    ON confirma_settings FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = confirma_settings.event_id 
            AND e.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Event owners can update confirma_settings" ON confirma_settings;
CREATE POLICY "Event owners can update confirma_settings" 
    ON confirma_settings FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = confirma_settings.event_id 
            AND e.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Event owners can delete confirma_settings" ON confirma_settings;
CREATE POLICY "Event owners can delete confirma_settings" 
    ON confirma_settings FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = confirma_settings.event_id 
            AND e.user_id = auth.uid()
        )
    );

-- Políticas para whatsapp_messages
DROP POLICY IF EXISTS "Event owners can view whatsapp_messages" ON whatsapp_messages;
CREATE POLICY "Event owners can view whatsapp_messages" 
    ON whatsapp_messages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = whatsapp_messages.event_id 
            AND e.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Event owners can manage whatsapp_messages" ON whatsapp_messages;
CREATE POLICY "Event owners can manage whatsapp_messages" 
    ON whatsapp_messages FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = whatsapp_messages.event_id 
            AND e.user_id = auth.uid()
        )
    );
