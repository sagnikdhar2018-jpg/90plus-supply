import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/cookies")({ component: Page });

function Page() {
  return (
    <LegalPage title="Cookies" kicker="Telemetry">
      <p>Essential: cart, wishlist, lab builds, orders. Optional: a consent flag only. No third-party ads on this demo.</p>
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem("90p_cookie_consent", "all");
            toast.success("Accepted");
          }}
        >
          Accept all
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            localStorage.setItem("90p_cookie_consent", "essential");
            toast.success("Essential only");
          }}
        >
          Essential only
        </Button>
      </div>
    </LegalPage>
  );
}
