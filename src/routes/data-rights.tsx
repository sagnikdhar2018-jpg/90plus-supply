import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/data-rights")({ component: Page });

function Page() {
  return (
    <LegalPage title="Data rights" kicker="DPDP portal">
      <p>Access, correct, or erase what this device stored for 90+ Supply.</p>
      <Button
        onClick={() => {
          localStorage.removeItem("90p-shop");
          localStorage.removeItem("90p-orders");
          localStorage.removeItem("90p-quotes");
          localStorage.removeItem("90p_cookie_consent");
          toast.success("Local locker erased — reload to reset cart");
        }}
      >
        Erase local data
      </Button>
    </LegalPage>
  );
}
