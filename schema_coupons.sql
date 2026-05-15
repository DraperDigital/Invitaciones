create table if not exists public.coupons (
  code text primary key,
  max_uses integer not null,
  current_uses integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.coupons (code, max_uses)
values ('INVITTO26', 20)
on conflict (code) do nothing;

-- Ensure only service role can modify this table securely
alter table public.coupons enable row level security;
create policy "Coupons are viewable by everyone." on public.coupons for select using (true);

-- Function to safely increment coupon uses
create or replace function public.increment_coupon_use(coupon_code text)
returns void as $$
begin
  update public.coupons
  set current_uses = current_uses + 1
  where code = coupon_code;
end;
$$ language plpgsql security definer;
