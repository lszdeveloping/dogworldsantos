create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.dogs (
  id text primary key,
  name text not null default '',
  breed text not null default '',
  size text not null default '',
  birth_date text not null default '',
  tutor_name text not null default '',
  tutor_phone text not null default '',
  service text not null default '',
  plan text not null default '',
  monthly_value double precision not null default 0,
  observations text not null default '',
  vaccines_up_to_date boolean not null default true,
  vaccine_expiry_date text not null default '',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.presences (
  id text primary key,
  dog_id text not null default '',
  date text not null default '',
  status text not null default '',
  check_in_time text,
  check_out_time text,
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  dog_id text not null default '',
  tutor_name text not null default '',
  service text not null default '',
  value double precision not null default 0,
  due_date text not null default '',
  status text not null default '',
  payment_method text,
  payment_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grooming_appointments (
  id text primary key,
  dog_id text,
  client_name text not null default '',
  tutor_name text not null default '',
  tutor_phone text not null default '',
  service text not null default '',
  date text not null default '',
  time text not null default '',
  value double precision not null default 0,
  observations text,
  status text not null default '',
  is_registered_dog boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_prices (
  id text primary key,
  name text not null default '',
  description text not null default '',
  category text not null default '',
  value double precision not null default 0,
  unit text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id text primary key,
  type text not null default '',
  dog_id text,
  dog_name text,
  tutor_name text,
  description text not null default '',
  date text not null default '',
  priority text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dogs enable row level security;
alter table public.presences enable row level security;
alter table public.payments enable row level security;
alter table public.grooming_appointments enable row level security;
alter table public.service_prices enable row level security;
alter table public.alerts enable row level security;

drop trigger if exists set_dogs_updated_at on public.dogs;
create trigger set_dogs_updated_at
before update on public.dogs
for each row execute function public.set_updated_at();

drop trigger if exists set_presences_updated_at on public.presences;
create trigger set_presences_updated_at
before update on public.presences
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists set_grooming_appointments_updated_at on public.grooming_appointments;
create trigger set_grooming_appointments_updated_at
before update on public.grooming_appointments
for each row execute function public.set_updated_at();

drop trigger if exists set_service_prices_updated_at on public.service_prices;
create trigger set_service_prices_updated_at
before update on public.service_prices
for each row execute function public.set_updated_at();

drop trigger if exists set_alerts_updated_at on public.alerts;
create trigger set_alerts_updated_at
before update on public.alerts
for each row execute function public.set_updated_at();

drop policy if exists "Authenticated users can read dogs" on public.dogs;
create policy "Authenticated users can read dogs"
on public.dogs for select to authenticated using (true);
drop policy if exists "Authenticated users can insert dogs" on public.dogs;
create policy "Authenticated users can insert dogs"
on public.dogs for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update dogs" on public.dogs;
create policy "Authenticated users can update dogs"
on public.dogs for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can delete dogs" on public.dogs;
create policy "Authenticated users can delete dogs"
on public.dogs for delete to authenticated using (true);

drop policy if exists "Authenticated users can read presences" on public.presences;
create policy "Authenticated users can read presences"
on public.presences for select to authenticated using (true);
drop policy if exists "Authenticated users can insert presences" on public.presences;
create policy "Authenticated users can insert presences"
on public.presences for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update presences" on public.presences;
create policy "Authenticated users can update presences"
on public.presences for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can delete presences" on public.presences;
create policy "Authenticated users can delete presences"
on public.presences for delete to authenticated using (true);

drop policy if exists "Authenticated users can read payments" on public.payments;
create policy "Authenticated users can read payments"
on public.payments for select to authenticated using (true);
drop policy if exists "Authenticated users can insert payments" on public.payments;
create policy "Authenticated users can insert payments"
on public.payments for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update payments" on public.payments;
create policy "Authenticated users can update payments"
on public.payments for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can delete payments" on public.payments;
create policy "Authenticated users can delete payments"
on public.payments for delete to authenticated using (true);

drop policy if exists "Authenticated users can read grooming appointments" on public.grooming_appointments;
create policy "Authenticated users can read grooming appointments"
on public.grooming_appointments for select to authenticated using (true);
drop policy if exists "Authenticated users can insert grooming appointments" on public.grooming_appointments;
create policy "Authenticated users can insert grooming appointments"
on public.grooming_appointments for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update grooming appointments" on public.grooming_appointments;
create policy "Authenticated users can update grooming appointments"
on public.grooming_appointments for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can delete grooming appointments" on public.grooming_appointments;
create policy "Authenticated users can delete grooming appointments"
on public.grooming_appointments for delete to authenticated using (true);

drop policy if exists "Authenticated users can read service prices" on public.service_prices;
create policy "Authenticated users can read service prices"
on public.service_prices for select to authenticated using (true);
drop policy if exists "Authenticated users can insert service prices" on public.service_prices;
create policy "Authenticated users can insert service prices"
on public.service_prices for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update service prices" on public.service_prices;
create policy "Authenticated users can update service prices"
on public.service_prices for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can delete service prices" on public.service_prices;
create policy "Authenticated users can delete service prices"
on public.service_prices for delete to authenticated using (true);

drop policy if exists "Authenticated users can read alerts" on public.alerts;
create policy "Authenticated users can read alerts"
on public.alerts for select to authenticated using (true);
drop policy if exists "Authenticated users can insert alerts" on public.alerts;
create policy "Authenticated users can insert alerts"
on public.alerts for insert to authenticated with check (true);
drop policy if exists "Authenticated users can update alerts" on public.alerts;
create policy "Authenticated users can update alerts"
on public.alerts for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated users can delete alerts" on public.alerts;
create policy "Authenticated users can delete alerts"
on public.alerts for delete to authenticated using (true);
