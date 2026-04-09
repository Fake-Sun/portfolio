create table if not exists public.portfolio_settings (
  id integer primary key,
  name text not null,
  title text not null,
  intro text not null,
  about text not null,
  email text not null,
  location text not null,
  availability text not null,
  primary_cta_label text not null,
  primary_cta_href text not null,
  secondary_cta_label text not null,
  secondary_cta_href text not null,
  focus_areas jsonb not null default '[]'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  translations jsonb not null default '{}'::jsonb
);

create table if not exists public.projects (
  slug text primary key,
  title text not null,
  tagline text not null,
  year text not null,
  category text not null,
  status text not null,
  impact text not null,
  summary text not null,
  challenge text not null,
  solution text not null,
  client text not null default '',
  role text not null default '',
  duration text not null default '',
  cover_image text not null default '',
  gallery_images jsonb not null default '[]'::jsonb,
  stack jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  accent text not null,
  translations jsonb not null default '{}'::jsonb
);

create table if not exists public.admin_config (
  id integer primary key,
  secret_hash text not null
);

create table if not exists public.admin_sessions (
  token_hash text primary key,
  expires_at timestamptz not null
);

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;
