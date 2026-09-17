import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const next = "/original.html#/locker-room";

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || email.split("@")[0] });
        if (res.error) throw new Error(res.error.message || "Could not create profile");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Invalid email or password");
      }
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 py-16 text-fg">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Player locker</p>
        <h1 className="mt-2 font-display text-4xl uppercase">Enter the locker room</h1>
        <p className="mt-2 text-sm text-muted">Save lab builds, checkout, and track orders on your account.</p>

        {isPending ? <div className="mt-8 h-10 animate-pulse rounded-md bg-white/5" /> : null}

        {!isPending && user ? (
          <div className="mt-8 space-y-4">
            <UserButton />
            <Link to="/" className="block text-sm text-volt underline-offset-4 hover:underline">
              Back to 90+ Supply
            </Link>
            <a href={next} className="block text-sm text-muted hover:text-fg">
              Open locker
            </a>
          </div>
        ) : null}

        {!isPending && !user && authEnabled ? (
          <div className="mt-8 space-y-3">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => void signIn(p.providerId, { callbackURL: next, errorCallbackURL: "/login" })}
                className="w-full rounded-md border border-line px-4 py-2.5 text-sm font-medium uppercase tracking-[0.12em] hover:border-volt/50 hover:bg-white/5"
              >
                Continue with {p.label}
              </button>
            ))}

            <p className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">or player credentials</p>

            <div className="flex gap-2 text-xs uppercase tracking-[0.12em]">
              <button type="button" className={mode === "in" ? "text-volt" : "text-subtle"} onClick={() => setMode("in")}>
                Sign in
              </button>
              <span className="text-subtle">/</span>
              <button type="button" className={mode === "up" ? "text-volt" : "text-subtle"} onClick={() => setMode("up")}>
                Create profile
              </button>
            </div>

            <form className="space-y-3" onSubmit={(e) => void onEmail(e)}>
              {mode === "up" ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Callsign"
                  className="h-11 w-full rounded-md border border-line bg-bg px-3 text-sm outline-none focus:border-volt/50"
                />
              ) : null}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@90plus.supply"
                className="h-11 w-full rounded-md border border-line bg-bg px-3 text-sm outline-none focus:border-volt/50"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6)"
                className="h-11 w-full rounded-md border border-line bg-bg px-3 text-sm outline-none focus:border-volt/50"
              />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-volt py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-volt-ink disabled:opacity-60"
              >
                {busy ? "Working…" : mode === "up" ? "Create profile" : "Sign in to locker"}
              </button>
            </form>
          </div>
        ) : null}

        {!isPending && !user && !authEnabled ? (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
        ) : null}
      </div>
    </main>
  );
}
