# Modelo de datos — Módulo Planeación (Invitto Pro)

Diseñado para enchufar en el esquema actual sin tocar nada de lo que ya corre.
Migración: **`schema_planning.sql`** (se ejecuta después de `schema.sql` y `schema_plans.sql`).

---

## Principio de diseño

Todo en Invitto cuelga del **evento**, no del usuario (un usuario tiene varios
eventos; la planeación vive dentro de cada uno). Así que las 5 tablas nuevas
hacen FK a `events(id)` con `on delete cascade` — si se borra el evento, se va
toda su planeación. Mismo patrón de PK/`created_at`/RLS/índices que `guests` y
`rsvps`, para que no haya un "dialecto" nuevo en la base.

Lo que **ya existe y se reutiliza** (no se duplica):

| Dato | De dónde sale | Lo usa |
|---|---|---|
| Invitados confirmados | `rsvps.status = 'yes'` + `plus_ones_confirmed` | costo por invitado |
| Fecha del evento | `events.date_time` | cuenta regresiva + fases del checklist |
| Acomodo de mesas | `guests.table_id` | pendiente "cerrar mesas" |
| Gating del plan | `features` + `plan_features` + `get_event_feature_access()` | mostrar/bloquear el módulo |

---

## Las 5 tablas nuevas

```
                              ┌──────────────┐
                              │    events    │  (ya existe)
                              └──────┬───────┘
          ┌───────────────┬─────────┼──────────┬──────────────┐
          │               │         │          │              │
   budget_categories   vendors   expenses  vendor_payments  tasks
   (lo estimado)    (directorio) (lo real) (calendario pago) (pendientes)
          ▲               ▲  ▲        │  │        │  │          │ │
          │               │  └────────┘  │        │  └──────────┘ │
          │               └──────────────┼────────┘               │
          └──────────────────────────────┴────────────────────────┘
             (expenses y tasks pueden colgar de una categoría;
              expenses, vendor_payments y tasks pueden colgar de un proveedor)
```

1. **`budget_categories`** — el **plan**. Un rubro por fila (Banquete, Música…)
   con su `estimated_amount`. `parent_id` opcional para subrubros.
2. **`vendors`** — directorio de **proveedores** con contacto y `status`
   (cotizando / contratado / cancelado).
3. **`expenses`** — lo **real contratado**. Un renglón por concepto, con su costo
   total. Liga opcional a categoría y a proveedor.
4. **`vendor_payments`** — el **calendario de pagos** (anticipos y parcialidades).
   Cada fila tiene `due_date` y `status`. Aquí nace "próximos anticipos" y los
   recordatorios.
5. **`tasks`** — **pendientes** con `phase` (fase relativa a la fecha) y `source`
   (`template` = sembrado por el asistente / `custom` = lo puso la pareja).

**Estimado vs real vs pagado** salen de tres tablas distintas y nunca se
contradicen: estimado = Σ `budget_categories`, real = Σ `expenses`,
pagado = Σ `vendor_payments` con `status='paid'`. El avance de pago no se guarda
a mano en ningún lado — se suma.

---

## Dónde vive el "asistente" (no agenda)

Dos funciones RPC hacen el trabajo que una hoja de cálculo te deja a ti:

### `get_event_planning_summary(event_id)` — el copiloto
Una sola llamada devuelve todo el tablero, cruzando presupuesto + pagos + RSVPs +
fecha:

- `cost_per_guest` = real ÷ invitados confirmados (del RSVP, en vivo)
- `pending_total` = real − pagado
- `next_payment` = el anticipo más cercano sin pagar, con `days_left`
- `overdue_count` = pagos vencidos
- `countdown_days` y `open_tasks_by_phase` para el roadmap

No guarda nada: **calcula y avisa**. Si entra un RSVP nuevo, el costo por invitado
se mueve solo.

### `seed_planning_defaults(event_id)` — arranque con trabajo hecho
Al activar el módulo, siembra los rubros de presupuesto y un checklist base por
fase según el tipo de evento. La pareja no empieza frente a una tabla vacía:
empieza con 8 rubros y 10 pendientes ya ordenados por cuándo tocan. Es
idempotente (no re-siembra si ya hay datos).

---

## Seguridad

- **RLS** en las 5 tablas: `exists(select 1 from events where id = X.event_id and user_id = auth.uid())`. Idéntico a `guests`/`rsvps`. Un usuario sólo ve la planeación de sus eventos.
- Las RPC son `security definer` (hacen bypass de RLS), así que validan ownership **a mano** al entrar (`v_owner <> auth.uid() → raise`). Sin ese check serían un IDOR — justo el riesgo que marcamos en invitalia.
- La feature `event_planning` queda en `ui_group = 'pro'` y se engancha al plan Pro. `get_event_feature_access()` ya la recoge; el frontend la ve `enabled` solo en eventos Pro, `locked` (con botón upgrade) en los demás. Cero código nuevo de gating.

---

## Lo que falta para cerrarlo (fuera del modelo)

- **Recordatorios de pago**: reusar el mecanismo de `reminders_automatic` /
  `last_reminder_at` que ya existe para invitados, apuntando a
  `vendor_payments.due_date` → marca `reminder_sent_at`.
- **Marcar `overdue`**: un cron diario (Supabase scheduled function) que pase a
  `status='overdue'` los `scheduled` con `due_date < hoy`.
- **Import de proveedores/presupuesto** desde Excel: ya tienen
  `guest_import_excel`; mismo patrón.
