import { ArrowUp, Mail, MessageSquare, Phone, Search, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/catalog";
import { TOOL_PAGES } from "@/data/loadouts";
import { FAQ } from "@/data/faq";
import { inr } from "@/lib/utils";

export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const captured: Record<string, string> = {};
    let hit = false;
    keys.forEach((k) => {
      const v = params.get(k);
      if (v) {
        captured[k] = v.slice(0, 100);
        hit = true;
      }
    });
    if (hit) {
      captured.timestamp = new Date().toISOString();
      sessionStorage.setItem("90p_utm_attribution", JSON.stringify(captured));
    }
  } catch {
    /* ignore */
  }
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const t = q.trim().toLowerCase();
  const products = useMemo(() => {
    if (t.length < 2) return [];
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(t) || p.categoryLabel.toLowerCase().includes(t) || p.shortDesc.toLowerCase().includes(t),
    ).slice(0, 6);
  }, [t]);
  const pages = useMemo(() => {
    if (t.length < 2) return [];
    return TOOL_PAGES.filter((p) => p.label.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t)).slice(0, 5);
  }, [t]);
  const faqs = useMemo(() => {
    if (t.length < 2) return [];
    return FAQ.filter((f) => f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t)).slice(0, 3);
  }, [t]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-start bg-[rgba(6,7,9,0.86)] p-4 pt-[12vh] backdrop-blur-xl" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-xl overflow-hidden rounded-[18px] border border-line bg-bg2 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="size-4 text-volt" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gear, tools, policies — / or Ctrl+K"
            className="h-14 flex-1 bg-transparent text-sm outline-none"
          />
          <button type="button" onClick={onClose} className="text-subtle" aria-label="Close search">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {t.length < 2 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">Type at least two letters. Try “PSI”, “lab”, or “socks”.</p>
          ) : null}
          {products.length > 0 ? (
            <div>
              <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Match gear</p>
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-surface"
                  onClick={() => {
                    void navigate({ to: "/product/$slug", params: { slug: p.slug } });
                    onClose();
                  }}
                >
                  <span>
                    <span className="block text-sm">{p.name}</span>
                    <span className="text-xs text-muted">{p.categoryLabel}</span>
                  </span>
                  <span className="font-mono text-sm text-volt">{inr(p.price)}</span>
                </button>
              ))}
            </div>
          ) : null}
          {pages.length > 0 ? (
            <div>
              <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Tools & pages</p>
              {pages.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 hover:bg-surface"
                >
                  <span className="block text-sm">{p.label}</span>
                  <span className="text-xs text-muted">{p.desc}</span>
                </Link>
              ))}
            </div>
          ) : null}
          {faqs.length > 0 ? (
            <div>
              <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">FAQ</p>
              {faqs.map((f) => (
                <Link key={f.q} to="/faq" onClick={onClose} className="block rounded-md px-3 py-2 text-sm hover:bg-surface">
                  {f.q}
                </Link>
              ))}
            </div>
          ) : null}
          {t.length >= 2 && !products.length && !pages.length && !faqs.length ? (
            <p className="px-3 py-6 text-center text-sm text-muted">No match for “{q}”.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ContactFab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-[92px] left-4 z-40 lg:bottom-6">
      {open ? (
        <div className="mb-2 w-56 overflow-hidden rounded-[14px] border border-line bg-bg2 py-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
          <a href="tel:+918009078775" className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface">
            <Phone className="size-4 text-volt" /> Helpline
          </a>
          <a href="mailto:support@90plus.supply" className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface">
            <Mail className="size-4 text-volt" /> Lab email
          </a>
          <Link to="/contact" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface">
            <Send className="size-4 text-volt" /> Support desk
          </Link>
        </div>
      ) : null}
      <button
        type="button"
        aria-label="Quick contact"
        onClick={() => setOpen((v) => !v)}
        className="grid size-12 place-items-center rounded-full border border-volt/50 bg-bg text-volt shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
      >
        {open ? <X className="size-5" /> : <MessageSquare className="size-5" />}
      </button>
    </div>
  );
}

export function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[92px] right-[11.5rem] z-40 hidden size-11 place-items-center rounded-full border border-line bg-bg2 text-fg shadow-[0_12px_32px_rgba(0,0,0,0.45)] md:grid lg:bottom-6"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
