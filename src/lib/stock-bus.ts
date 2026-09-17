type StockListener = (payload: unknown) => void;

const g = globalThis as typeof globalThis & {
  __stockListeners__?: Set<StockListener>;
  __stockEpoch__?: number;
};

function listeners() {
  if (!g.__stockListeners__) g.__stockListeners__ = new Set();
  return g.__stockListeners__;
}

export function stockEpoch() {
  return g.__stockEpoch__ ?? Date.now();
}

export function bumpStockEpoch() {
  g.__stockEpoch__ = Date.now();
}

export function publishStock(payload: unknown) {
  bumpStockEpoch();
  for (const listener of listeners()) {
    try {
      listener(payload);
    } catch {
      /* ignore a dead subscriber */
    }
  }
}

export function subscribeStock(listener: StockListener) {
  listeners().add(listener);
  return () => {
    listeners().delete(listener);
  };
}
