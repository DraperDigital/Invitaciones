# Frontend — Módulo Planeación

Código que se integra al dashboard existente de Invitto siguiendo sus convenciones
(client Supabase schema `invitto`, `useFeatureAccess`, `useAuth`, `useToast`,
react-router, Tailwind con `#DF3B94` / `#222B38`).

## Archivos nuevos

| Archivo | Qué es |
|---|---|
| `src/hooks/usePlanning.ts` | Hook de datos. Trae el resumen (RPC `get_event_planning_summary`) + las 5 tablas, expone CRUD mínimo y `seedDefaults`. Degrada a datos de ejemplo si no hay `VITE_SUPABASE_URL` (modo mock, igual que `useFeatureAccess`). |
| `src/pages/dashboard/Planning.tsx` | La página. Selector de evento + 4 subpestañas (Copiloto, Presupuesto, Proveedores, Pendientes). Bloqueada con pantalla de upgrade si el evento no es Pro (`hasFeature('event_planning')`). |

## Archivos modificados (wiring)

| Archivo | Cambio |
|---|---|
| `src/App.tsx` | `lazy` import de `Planning` + rutas `dashboard/planeacion` y `dashboard/planeacion/:id`. |
| `src/components/layout/DashboardLayout.tsx` | Nuevo item de nav **Planeación** (icono `ClipboardList`), entre Escanear QR y Configuración. |
| `src/hooks/useFeatureAccess.ts` | Agregado `event_planning` a la lista Pro y al fallback, para que desbloquee aunque la RPC falle. |

## Cómo se conecta a lo que ya existe

- **Confirmados y costo por invitado**: salen del RSVP (`get_event_planning_summary`
  suma `rsvps` con status `yes` + acompañantes). No se captura a mano.
- **Cuenta regresiva**: de `events.date_time`.
- **Estimado / Real / Pagado**: de `budget_categories` / `expenses` / `vendor_payments`
  (las 3 tablas nuevas), nunca duplicado.
- **Gating**: `useFeatureAccess` ya existente; sólo se registró la feature `event_planning`.

## Para probarlo

1. Corre la migración `schema_planning.sql` en Supabase (schema `invitto`).
2. Pon un evento en plan Pro (`event_subscriptions` o `profiles.plan_tier='pro'`).
3. `npm install && npm run dev` → entra a **Planeación** en el sidebar.
4. En Pendientes, botón **Sembrar checklist base** → llama `seed_planning_defaults`.

> Nota: no se ejecutó `tsc`/build porque el repo se clonó sin `node_modules`.
> El código sigue los flags del `tsconfig.app.json` (strict, verbatimModuleSyntax,
> noUnusedLocals) y el mismo patrón de las páginas existentes; corre `npm run build`
> para confirmarlo en tu entorno.
