-- Modifica el valor por defecto de los nuevos perfiles a 'free' en lugar de 'clasico'
alter table public.profiles alter column plan_tier set default 'free';

-- Opcional: Si quieres actualizar los usuarios que se crearon hoy con 'clasico' pero no han pagado, puedes ejecutar esto bajo tu propio riesgo:
-- update public.profiles set plan_tier = 'free' where plan_tier = 'clasico';
