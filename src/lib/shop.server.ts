import { PRODUCTS } from "@/data/catalog";
import { getSql } from "@/lib/db";
import { bumpStockEpoch, publishStock, stockEpoch } from "@/lib/stock-bus";

export const LOW_STOCK_AT = 8;

export function alertLevel(stockCount: number, inStock: boolean): "ok" | "low" | "critical" | "out" {
  if (!inStock || stockCount <= 0) return "out";
  if (stockCount <= 3) return "critical";
  if (stockCount <= LOW_STOCK_AT) return "low";
  return "ok";
}

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  categoryLabel: string;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string | null;
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  shortDesc: string;
  alert: "ok" | "low" | "critical" | "out";
};

export type OrderLineIn = {
  productId: string;
  qty: number;
  customName?: string;
  customNumber?: string;
};

export type PlaceOrderInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  pin: string;
  paymentMethod?: string;
  coupon?: string;
  lines: OrderLineIn[];
};

export type PlacedOrder = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string | null;
  paymentMethod: string;
  status: string;
  trackingNumber: string | null;
  createdAt: string;
  items: { productId: string; name: string; qty: number; unitPrice: number }[];
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  category_label: string;
  price: number;
  compare_at: number;
  rating: number;
  reviews_count: number;
  badge: string | null;
  in_stock: boolean;
  stock_count: number;
  is_new: boolean;
  is_best_seller: boolean;
  short_desc: string;
};

function mapProduct(row: ProductRow): CatalogProduct {
  const stockCount = Number(row.stock_count);
  const inStock = Boolean(row.in_stock) && stockCount > 0;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    category: row.category,
    categoryLabel: row.category_label,
    price: Number(row.price),
    compareAtPrice: Number(row.compare_at),
    rating: Number(row.rating),
    reviewsCount: Number(row.reviews_count),
    badge: row.badge,
    inStock,
    stockCount,
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    shortDesc: row.short_desc,
    alert: alertLevel(stockCount, inStock),
  };
}

let seeded = false;

export async function ensureCatalogSeeded() {
  if (seeded) return;
  const sql = await getSql();
  /* Upsert active seed heroes even when DB already has older sample rows (Wave A jersey etc.). */
  for (const p of PRODUCTS.filter((row) => row.active !== false)) {
    await sql`
      insert into products (
        id, slug, name, sku, category, category_label, price, compare_at,
        rating, reviews_count, badge, in_stock, stock_count, is_new, is_best_seller,
        colorway_idx, finish_idx, short_desc, full_desc, features
      ) values (
        ${p.id}, ${p.slug}, ${p.name}, ${p.sku}, ${p.category}, ${p.categoryLabel},
        ${p.price}, ${p.compareAtPrice}, ${p.rating}, ${p.reviewsCount},
        ${p.badge ?? null}, ${p.inStock}, ${0}, ${p.isNew}, ${p.isBestSeller},
        ${p.colorwayIdx}, ${p.finishIdx}, ${p.shortDesc}, ${p.fullDesc},
        ${JSON.stringify(p.features)}::jsonb
      )
      on conflict (id) do update set
        slug = excluded.slug,
        name = excluded.name,
        sku = excluded.sku,
        category = excluded.category,
        category_label = excluded.category_label,
        price = excluded.price,
        compare_at = excluded.compare_at,
        badge = excluded.badge,
        in_stock = excluded.in_stock,
        is_new = excluded.is_new,
        is_best_seller = excluded.is_best_seller,
        short_desc = excluded.short_desc,
        full_desc = excluded.full_desc,
        features = excluded.features
    `;
  }
  seeded = true;
}

const STOCK_PRESSURE: Record<string, number> = {
  "ball-volt-pro": 3,
  "ball-shadow-noir": 0,
  "guard-carbon-pro": 2,
  "sock-apex-volt": 6,
  "sock-pack-5-squad": 1,
};

async function applyStockPressure() {
  const sql = await getSql();
  const row = await sql<{ stock_count: number }>`select stock_count from products where id = ${"ball-volt-pro"} limit 1`;
  if (!row[0] || Number(row[0].stock_count) !== 40) return;
  for (const [id, count] of Object.entries(STOCK_PRESSURE)) {
    await sql`
      update products
      set stock_count = ${count}, in_stock = ${count > 0}
      where id = ${id}
    `;
  }
}

export async function listCatalog(): Promise<CatalogProduct[]> {
  await ensureCatalogSeeded();
  await applyStockPressure();
  const sql = await getSql();
  const rows = await sql<ProductRow>`
    select id, slug, name, sku, category, category_label, price, compare_at,
           rating, reviews_count, badge, in_stock, stock_count, is_new, is_best_seller, short_desc
    from products
    order by is_best_seller desc, name asc
  `;
  const activeIds = new Set(PRODUCTS.filter((p) => p.active !== false).map((p) => p.id));
  return rows.map(mapProduct).filter((p) => activeIds.has(p.id));
}

export async function listInventoryAlerts() {
  await ensureCatalogSeeded();
  await applyStockPressure();
  const sql = await getSql();
  const rows = await sql<ProductRow>`
    select id, slug, name, sku, category, category_label, price, compare_at,
           rating, reviews_count, badge, in_stock, stock_count, is_new, is_best_seller, short_desc
    from products
    where stock_count <= ${LOW_STOCK_AT}
    order by stock_count asc, name asc
  `;
  return rows.map(mapProduct);
}

export async function subscribeRestock(opts: { email: string; productId: string; userId?: string | null }) {
  await ensureCatalogSeeded();
  const email = opts.email.trim().toLowerCase().slice(0, 120);
  const productId = opts.productId.trim();
  if (!email.includes("@") || !productId) throw new Error("Need a valid email and product");
  const sql = await getSql();
  const exists = await sql<{ id: string }>`select id from products where id = ${productId} limit 1`;
  if (!exists[0]) throw new Error("Unknown product");
  await sql`
    insert into restock_alerts (user_id, email, product_id)
    values (${opts.userId ?? null}, ${email}, ${productId})
    on conflict (email, product_id) do nothing
  `;
  return { ok: true };
}

export type StockMovement = {
  id: number;
  productId: string;
  name: string;
  delta: number;
  remaining: number;
  reason: string;
  orderId: string | null;
  createdAt: string;
};

export type LiveInventory = {
  version: number;
  updatedAt: string;
  items: CatalogProduct[];
  movements: StockMovement[];
};

async function ensureStockLedger() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists stock_movements (
      id serial primary key,
      product_id text not null,
      delta integer not null,
      remaining integer not null,
      reason text not null default 'sale',
      order_id text,
      created_at timestamptz not null default now()
    )
  `);
}

export async function getLiveInventory(): Promise<LiveInventory> {
  await ensureCatalogSeeded();
  await applyStockPressure();
  await ensureStockLedger();
  const sql = await getSql();
  const rows = await sql<ProductRow>`
    select id, slug, name, sku, category, category_label, price, compare_at,
           rating, reviews_count, badge, in_stock, stock_count, is_new, is_best_seller, short_desc
    from products
    order by stock_count asc, name asc
  `;
  let movements: StockMovement[] = [];
  try {
    const logs = await sql<{
      id: number;
      product_id: string;
      delta: number;
      remaining: number;
      reason: string;
      order_id: string | null;
      created_at: string;
      name: string;
    }>`
      select m.id, m.product_id, m.delta, m.remaining, m.reason, m.order_id, m.created_at, p.name
      from stock_movements m
      join products p on p.id = m.product_id
      order by m.id desc
      limit 24
    `;
    movements = logs.map((row) => ({
      id: Number(row.id),
      productId: row.product_id,
      name: row.name,
      delta: Number(row.delta),
      remaining: Number(row.remaining),
      reason: row.reason,
      orderId: row.order_id,
      createdAt: String(row.created_at),
    }));
  } catch {
    movements = [];
  }
  const lastId = movements[0]?.id ?? 0;
  return {
    version: lastId * 1000 + (stockEpoch() % 1000),
    updatedAt: new Date().toISOString(),
    items: rows.map(mapProduct),
    movements,
  };
}

function newOrderId() {
  return `90P-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
}

export async function placeOrder(userId: string, input: PlaceOrderInput): Promise<PlacedOrder> {
  await ensureCatalogSeeded();
  await ensureStockLedger();
  const sql = await getSql();

  const name = input.name.trim().slice(0, 100);
  const email = input.email.trim().toLowerCase().slice(0, 120);
  const phone = input.phone.replace(/\D/g, "").slice(0, 15);
  const address = input.address.trim().slice(0, 200);
  const city = input.city.trim().slice(0, 80);
  const state = (input.state ?? "").trim().slice(0, 80);
  const pin = input.pin.replace(/\D/g, "").slice(0, 6);
  const lines = Array.isArray(input.lines) ? input.lines : [];

  if (!name || !email.includes("@") || phone.length < 10 || address.length < 5 || city.length < 2 || pin.length !== 6) {
    throw new Error("Fill name, email, 10-digit phone, address, city, and 6-digit PIN");
  }
  if (lines.length === 0) throw new Error("Cart is empty");

  const priced: { productId: string; name: string; qty: number; unitPrice: number; customName: string | null; customNumber: string | null }[] = [];
  let subtotal = 0;

  for (const line of lines) {
    const qty = Math.min(10, Math.max(1, Math.floor(Number(line.qty) || 1)));
    const rows = await sql<ProductRow>`select * from products where id = ${line.productId} limit 1`;
    const product = rows[0];
    if (!product) throw new Error("A kit item is no longer available");
    if (Number(product.stock_count) < qty) throw new Error(`${product.name} is low on stock`);
    const unit = Number(product.price);
    subtotal += unit * qty;
    priced.push({
      productId: product.id,
      name: product.name,
      qty,
      unitPrice: unit,
      customName: line.customName?.slice(0, 14) || null,
      customNumber: line.customNumber?.slice(0, 2) || null,
    });
  }

  const coupon = (input.coupon ?? "").trim().toUpperCase();
  let discount = 0;
  if (coupon === "FIRST90" && subtotal >= 150) discount = 150;

  const shipping = subtotal - discount >= 999 || subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);
  const id = newOrderId();
  const tracking = `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`;
  const method = (input.paymentMethod || "cod").slice(0, 20);

  await sql`
    insert into orders (
      id, user_id, name, email, phone, address, city, state, pin,
      subtotal, discount, shipping, total, coupon, payment_method, status, tracking_number
    ) values (
      ${id}, ${userId}, ${name}, ${email}, ${phone}, ${address}, ${city}, ${state}, ${pin},
      ${subtotal}, ${discount}, ${shipping}, ${total}, ${coupon || null}, ${method}, ${"packed"}, ${tracking}
    )
  `;

  for (const item of priced) {
    await sql`
      insert into order_items (order_id, product_id, name, qty, unit_price, custom_name, custom_number)
      values (${id}, ${item.productId}, ${item.name}, ${item.qty}, ${item.unitPrice}, ${item.customName}, ${item.customNumber})
    `;
    await sql`
      update products
      set stock_count = greatest(0, stock_count - ${item.qty}),
          in_stock = (stock_count - ${item.qty}) > 0
      where id = ${item.productId}
    `;
    const left = await sql<{ stock_count: number }>`select stock_count from products where id = ${item.productId} limit 1`;
    const remaining = Number(left[0]?.stock_count ?? 0);
    await sql`
      insert into stock_movements (product_id, delta, remaining, reason, order_id)
      values (${item.productId}, ${-item.qty}, ${remaining}, ${"sale"}, ${id})
    `;
  }

  if (coupon === "FIRST90") {
    await sql`update coupons set uses = uses + 1 where code = ${"FIRST90"}`;
  }

  bumpStockEpoch();
  const live = await getLiveInventory();
  publishStock(live);

  return {
    id,
    userId,
    name,
    email,
    phone,
    address,
    city,
    state,
    pin,
    subtotal,
    discount,
    shipping,
    total,
    coupon: coupon || null,
    paymentMethod: method,
    status: "packed",
    trackingNumber: tracking,
    createdAt: new Date().toISOString(),
    items: priced.map((i) => ({
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      unitPrice: i.unitPrice,
    })),
  };
}

export async function getOrderForUser(userId: string, orderId: string): Promise<PlacedOrder | null> {
  const sql = await getSql();
  const orders = await sql<{
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    coupon: string | null;
    payment_method: string;
    status: string;
    tracking_number: string | null;
    created_at: string;
  }>`select * from orders where id = ${orderId} and user_id = ${userId} limit 1`;
  const order = orders[0];
  if (!order) return null;
  const items = await sql<{
    product_id: string;
    name: string;
    qty: number;
    unit_price: number;
  }>`select product_id, name, qty, unit_price from order_items where order_id = ${orderId}`;
  return {
    id: order.id,
    userId: order.user_id,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    pin: order.pin,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shipping: Number(order.shipping),
    total: Number(order.total),
    coupon: order.coupon,
    paymentMethod: order.payment_method,
    status: order.status,
    trackingNumber: order.tracking_number,
    createdAt: String(order.created_at),
    items: items.map((i) => ({
      productId: i.product_id,
      name: i.name,
      qty: Number(i.qty),
      unitPrice: Number(i.unit_price),
    })),
  };
}

export async function trackOrderPublic(orderId: string): Promise<Pick<PlacedOrder, "id" | "city" | "total" | "status" | "trackingNumber" | "createdAt" | "items"> | null> {
  const sql = await getSql();
  const orders = await sql<{
    id: string;
    city: string;
    total: number;
    status: string;
    tracking_number: string | null;
    created_at: string;
  }>`select id, city, total, status, tracking_number, created_at from orders where id = ${orderId} limit 1`;
  const order = orders[0];
  if (!order) return null;
  const items = await sql<{
    product_id: string;
    name: string;
    qty: number;
    unit_price: number;
  }>`select product_id, name, qty, unit_price from order_items where order_id = ${orderId}`;
  return {
    id: order.id,
    city: order.city,
    total: Number(order.total),
    status: order.status,
    trackingNumber: order.tracking_number,
    createdAt: String(order.created_at),
    items: items.map((i) => ({
      productId: i.product_id,
      name: i.name,
      qty: Number(i.qty),
      unitPrice: Number(i.unit_price),
    })),
  };
}

export async function listOrdersForUser(userId: string): Promise<PlacedOrder[]> {
  const sql = await getSql();
  const orders = await sql<{ id: string }>`select id from orders where user_id = ${userId} order by created_at desc limit 20`;
  const out: PlacedOrder[] = [];
  for (const row of orders) {
    const full = await getOrderForUser(userId, row.id);
    if (full) out.push(full);
  }
  return out;
}
