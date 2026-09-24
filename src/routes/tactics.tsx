import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Canonical tactics board lives on the hash SPA (`/original.html#/tactics`).
 * Deep-links from loadouts etc. must not land on a second React stub board.
 */
export const Route = createFileRoute("/tactics")({ component: TacticsRedirect });

function TacticsRedirect() {
  useEffect(() => {
    window.location.replace("/original.html#/tactics");
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-volt">Tactics board</p>
      <h1 className="mt-2 font-display text-5xl uppercase">Opening whiteboard…</h1>
      <p className="mt-2 max-w-xl text-muted">
        Redirecting to the matchday pitch board.{" "}
        <a className="text-volt underline" href="/original.html#/tactics">
          Continue
        </a>
      </p>
    </div>
  );
}
