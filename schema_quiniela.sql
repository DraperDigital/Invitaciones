-- SQL para crear la tabla de quiniela en Supabase
create table if not exists public.quiniela_predictions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  invitation_slug text not null default 'carlos-y-frida',
  name text not null,
  gender text not null, -- 'niño' | 'niña' | 'sorpresa'
  date date not null    -- Ej: 2027-01-15
);

-- Habilitar RLS (Row Level Security)
alter table public.quiniela_predictions enable row level security;

-- Permitir lecturas públicas (para ver las predicciones de la familia)
create policy "Permitir lecturas anonimas" on public.quiniela_predictions
  for select to anon using (true);

-- Permitir inserciones públicas (para enviar el voto sin necesidad de login)
create policy "Permitir inserciones anonimas" on public.quiniela_predictions
  for insert to anon with check (true);
