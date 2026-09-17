import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/returns")({ component: Page });

function Page() {
  return (
    <LegalPage title="Returns" kicker="14-day pickup">
      <p>Unworn kit in original packaging: doorstep reverse pickup, no extra fee, across 28,000+ PIN codes.</p>
      <p>Custom laser-embossed balls and used shin guards are not returnable.</p>
      <p>
        Open a ticket from the <Link to="/contact" className="text-volt">contact desk</Link> with your order ID.
      </p>
    </LegalPage>
  );
}
