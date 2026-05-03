import { Link, useLocation } from "wouter";
import { Dog, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const getADogLinks = [
    { href: "/find-a-breeder", label: "Find a Breeder" },
    { href: "/rescue", label: "Rescue" },
    { href: "/ethical-sourcing", label: "Ethical Sourcing" },
  ];

  const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/breeds", label: "Breeds" },
    { href: "/compare", label: "Compare" },
    { href: "/dog-breed-selector", label: "Quiz" },
  ];

  const trailingLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/products", label: "Products" },
  ];

  const navLinks = [...primaryLinks, ...getADogLinks, ...trailingLinks];

  const isGetADogActive = getADogLinks.some((l) => location === l.href);

  const footerLegalLinks = [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/sitemap", label: "Sitemap" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href="/" data-testid="link-home-logo">
              <div className="flex items-center gap-2 cursor-pointer shrink-0">
                <Dog className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
                <span className="text-base sm:text-lg lg:text-xl font-bold text-primary leading-tight whitespace-nowrap">
                  Dog Breeds &amp; Needs
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 justify-center max-w-xs xl:max-w-md mx-2">
              <SearchAutocomplete variant="desktop" />
            </div>

            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" data-testid="nav-desktop">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-2 xl:px-2.5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`inline-flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors whitespace-nowrap focus:outline-none ${
                      isGetADogActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    data-testid="link-nav-get-a-dog"
                  >
                    Get a Dog
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {getADogLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        <span
                          className="w-full cursor-pointer"
                          data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {trailingLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-2 xl:px-2.5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
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

            <div className="lg:hidden flex items-center gap-2">
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
          <div className="lg:hidden border-t" data-testid="nav-mobile">
            <div className="px-4 py-3 space-y-1">
              {primaryLinks.map((link) => (
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
              <div className="pt-2 pb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Get a Dog
              </div>
              {getADogLinks.map((link) => (
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
              <div className="pt-2" />
              {trailingLinks.map((link) => (
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
                <Dog className="h-6 w-6 text-primary shrink-0" />
                <span className="text-lg font-bold text-primary leading-tight whitespace-nowrap">Dog Breeds &amp; Needs</span>
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
                      <span className="hover:text-primary cursor-pointer" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerLegalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="hover:text-primary cursor-pointer" data-testid={`link-footer-legal-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>{link.label}</span>
                    </Link>
                  </li>
                ))}
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
