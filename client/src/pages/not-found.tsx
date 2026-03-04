import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Dog, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <Dog className="h-20 w-20 mx-auto text-muted-foreground/40 mb-6" />
        <h1 className="text-6xl font-bold text-primary mb-2" data-testid="text-404-title">404</h1>
        <h2 className="text-2xl font-semibold mb-3" data-testid="text-404-heading">Page Not Found</h2>
        <p className="text-muted-foreground mb-8" data-testid="text-404-message">
          Looks like this page has wandered off the trail. Don't worry — there are plenty of breeds to explore!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" data-testid="button-404-home">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </Link>
          <Link href="/breeds">
            <Button size="lg" variant="outline" data-testid="button-404-breeds">
              <Search className="mr-2 h-4 w-4" /> Browse Breeds
            </Button>
          </Link>
          <Button size="lg" variant="ghost" onClick={() => window.history.back()} data-testid="button-404-back">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
