import { useEffect } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
      window.location.replace("/original.html");
    }
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <p className="sr-only">
        90+ Supply — Football Accessories Built Different. Shop, Match Ball Lab, CFD, Academy, Tactics.
      </p>
      {children}
    </div>
  );
}
