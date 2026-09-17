import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({ component: Page });

function Page() {
  return (
    <LegalPage title="Privacy notice" kicker="DPDP 2023">
      <p>90+ Supply processes order details you type at checkout on this device. We do not sell personal data.</p>
      <p>Cart, wishlist, lab builds, and quotes stay in browser storage unless you clear it. Optional cookie consent is recorded locally.</p>
      <p>To erase local data, use the Data rights page or clear site storage in your browser.</p>
    </LegalPage>
  );
}
