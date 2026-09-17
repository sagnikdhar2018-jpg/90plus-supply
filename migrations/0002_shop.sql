-- 90+ Supply catalog, orders, lab saves, wishlists, coupons

create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  sku text not null,
  category text not null,
  category_label text not null,
  price integer not null,
  compare_at integer not null default 0,
  rating double precision not null default 0,
  reviews_count integer not null default 0,
  badge text,
  in_stock boolean not null default true,
  stock_count integer not null default 40,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  colorway_idx integer not null default 0,
  finish_idx integer not null default 0,
  short_desc text not null default '',
  full_desc text not null default '',
  features jsonb not null default '[]'::jsonb
);

create table if not exists orders (
  id text primary key,
  user_id text not null,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null default '',
  pin text not null,
  subtotal integer not null,
  discount integer not null default 0,
  shipping integer not null default 0,
  total integer not null,
  coupon text,
  payment_method text not null default 'cod',
  status text not null default 'packed',
  tracking_number text,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_email_idx on orders (email);

create table if not exists order_items (
  id serial primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  qty integer not null,
  unit_price integer not null,
  custom_name text,
  custom_number text
);
create index if not exists order_items_order_id_idx on order_items (order_id);

create table if not exists lab_builds (
  id serial primary key,
  user_id text not null,
  name text not null default '',
  number text not null default '',
  colorway_idx integer not null default 0,
  finish_idx integer not null default 0,
  psi integer not null default 12,
  created_at timestamptz not null default now()
);
create index if not exists lab_builds_user_id_idx on lab_builds (user_id);

create table if not exists wishlists (
  user_id text not null,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists coupons (
  code text primary key,
  amount integer not null,
  min_subtotal integer not null default 0,
  uses integer not null default 0
);

insert into coupons (code, amount, min_subtotal, uses)
  values ('FIRST90', 150, 150, 0)
  on conflict (code) do nothing;

create table if not exists subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);
