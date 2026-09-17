create table if not exists restock_alerts (
  id serial primary key,
  user_id text,
  email text not null,
  product_id text not null,
  created_at timestamptz not null default now(),
  unique (email, product_id)
);
create index if not exists restock_alerts_product_idx on restock_alerts (product_id);

update products set stock_count = 3, in_stock = true where id = 'ball-volt-pro';
update products set stock_count = 0, in_stock = false where id = 'ball-shadow-noir';
update products set stock_count = 2, in_stock = true where id = 'guard-carbon-pro';
update products set stock_count = 6, in_stock = true where id = 'sock-apex-volt';
update products set stock_count = 1, in_stock = true where id = 'sock-pack-5-squad';
