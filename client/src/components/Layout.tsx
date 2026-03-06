import { Link, useLocation } from "wouter";
import { Dog, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    setDark(!dark);
    if (!dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} data-testid="button-theme-toggle">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/breeds", label: "Breeds" },
    { href: "/dog-breed-selector", label: "Breed Quiz" },
    { href: "/ethical-sourcing", label: "Ethical Sourcing" },
    { href: "/find-a-breeder", label: "Find a Breeder" },
    { href: "/products", label: "Products" },
    { href: "/sitemap", label: "Sitemap" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" data-testid="link-home-logo">
              <div className="flex items-center gap-2 cursor-pointer">
                <Dog className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary leading-tight">Dog Breeds<br/>& Needs</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                      location === link.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <ThemeToggle />
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t" data-testid="nav-mobile">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      location === link.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dog className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-primary leading-tight">Dog Breeds<br/>& Needs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete guide to all 205 AKC-recognized dog breeds. Find the perfect companion for your lifestyle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="hover:text-primary cursor-pointer">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/ethical-sourcing">
                    <span className="hover:text-primary cursor-pointer">Ethical Sourcing Guide</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin">
                    <span className="hover:text-primary cursor-pointer">Admin Panel</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            DogBreedsAndNeeds.com - All 205 AKC-Recognized Dog Breeds
          </div>
        </div>
      </footer>
    </div>
  );
}
