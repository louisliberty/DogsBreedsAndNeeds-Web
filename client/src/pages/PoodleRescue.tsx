import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PoodleRescue() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/rescue/poodle", { replace: true });
  }, [setLocation]);
  return (
    <div className="py-12 text-center text-muted-foreground" data-testid="text-poodle-rescue-redirect">
      Redirecting to the Poodle rescue directory…
    </div>
  );
}
