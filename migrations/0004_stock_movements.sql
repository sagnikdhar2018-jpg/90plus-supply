create table if not exists stock_movements (
  id serial primary key,
  product_id text not null,
  delta integer not null,
  remaining integer not null,
  reason text not null default 'sale',
  order_id text,
  created_at timestamptz not null default now()
);
create index if not exists stock_movements_created_idx on stock_movements (created_at desc);
create index if not exists stock_movements_product_idx on stock_movements (product_id);
