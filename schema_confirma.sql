-- Migración aditiva para Invitto Confirma (Asistente de Confirmación por WhatsApp y Cadencia Outbound)
-- 100% Aditiva e idempotente

-- 1. Campo source en rsvps ('form' | 'whatsapp' | 'manual')
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS source text DEFAULT 'form';
COMMENT ON COLUMN rsvps.source IS 'Procedencia de la confirmación: form | whatsapp | manual';

CREATE INDEX IF NOT EXISTS idx_rsvps_source ON rsvps(source);

-- 2. Opt-in de WhatsApp y motivo de declinación en guests
ALTER TABLE guests ADD COLUMN IF NOT EXISTS whatsapp_opt_in boolean DEFAULT false;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS decline_reason text;
COMMENT ON COLUMN guests.whatsapp_opt_in IS 'Indica si el invitado dio opt-in para recibir su pase y recordatorios por WhatsApp';
COMMENT ON COLUMN guests.decline_reason IS 'Motivo opcional de por qué el invitado no podrá asistir';

-- 3. Configuración del servicio Confirma por evento y cadencia automática
CREATE TABLE IF NOT EXISTS confirma_settings (
    event_id text PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
    enabled boolean NOT NULL DEFAULT false,
    business_number text NOT NULL DEFAULT '',
    quota_contacts integer NOT NULL DEFAULT 200,
    used_conversations integer NOT NULL DEFAULT 0,
    auto_reminders_enabled boolean NOT NULL DEFAULT false,
    reminder_cadence_days integer NOT NULL DEFAULT 7,
    final_reminder_hours integer NOT NULL DEFAULT 48,
    last_cadence_run_at timestamptz,
    activated_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz
);

-- Si la tabla ya existía, agregamos columnas de cadencia de forma idempotente
ALTER TABLE confirma_settings ADD COLUMN IF NOT EXISTS auto_reminders_enabled boolean DEFAULT false;
ALTER TABLE confirma_settings ADD COLUMN IF NOT EXISTS reminder_cadence_days integer DEFAULT 7;
ALTER TABLE confirma_settings ADD COLUMN IF NOT EXISTS final_reminder_hours integer DEFAULT 48;
ALTER TABLE confirma_settings ADD COLUMN IF NOT EXISTS last_cadence_run_at timestamptz;

COMMENT ON TABLE confirma_settings IS 'Configuración, estado del bot de confirmación WhatsApp y motor de cadencia por evento';

-- 4. Log de conversación de WhatsApp
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

-- 5. Registro y despachador de rondas de recordatorios automáticos
CREATE TABLE IF NOT EXISTS confirma_reminders_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id text NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    round_number integer NOT NULL DEFAULT 1,
    channel text NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email')),
    recipient text NOT NULL,
    status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    sent_at timestamptz DEFAULT now()
);

COMMENT ON TABLE confirma_reminders_log IS 'Bitácora de rondas de seguimiento y recordatorios automáticos a invitados pendientes';

CREATE INDEX IF NOT EXISTS idx_confirma_reminders_log_event ON confirma_reminders_log(event_id);
CREATE INDEX IF NOT EXISTS idx_confirma_reminders_log_guest ON confirma_reminders_log(guest_id);
CREATE INDEX IF NOT EXISTS idx_confirma_reminders_log_sent ON confirma_reminders_log(sent_at DESC);

-- 6. RLS y Políticas de Seguridad
ALTER TABLE confirma_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirma_reminders_log ENABLE ROW LEVEL SECURITY;

-- Políticas para confirma_settings
DROP POLICY IF EXISTS "Public read confirma_settings for invitations" ON confirma_settings;
CREATE POLICY "Public read confirma_settings for invitations" 
    ON confirma_settings FOR SELECT 
    USING (true);

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

-- Políticas para confirma_reminders_log
DROP POLICY IF EXISTS "Event owners can view confirma_reminders_log" ON confirma_reminders_log;
CREATE POLICY "Event owners can view confirma_reminders_log" 
    ON confirma_reminders_log FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = confirma_reminders_log.event_id 
            AND e.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Event owners can manage confirma_reminders_log" ON confirma_reminders_log;
CREATE POLICY "Event owners can manage confirma_reminders_log" 
    ON confirma_reminders_log FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM events e 
            WHERE e.id = confirma_reminders_log.event_id 
            AND e.user_id = auth.uid()
        )
    );
