import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({ component: Page });

function Page() {
  return (
    <LegalPage title="Terms" kicker="House rules">
      <p>This preview store is a demonstration. Checkout is simulated and no real payment is taken.</p>
      <p>Custom-embossed match balls are final sale. Match PSI 11.6–14.5. Use FIRST90 for ₹150 off first demo orders.</p>
      <p>Governing law for a live shop: India. Child-sized gear is sold for sport, not as toys for under-3s.</p>
    </LegalPage>
  );
}
