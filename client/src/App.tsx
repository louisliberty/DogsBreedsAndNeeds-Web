import { useEffect, useRef, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";

const Breeds = lazy(() => import("@/pages/Breeds"));
const BreedDetail = lazy(() => import("@/pages/BreedDetail"));
const Compare = lazy(() => import("@/pages/Compare"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const EthicalSourcing = lazy(() => import("@/pages/EthicalSourcing"));
const FindABreeder = lazy(() => import("@/pages/FindABreeder"));
const PoodleRescue = lazy(() => import("@/pages/PoodleRescue"));
const Rescue = lazy(() => import("@/pages/Rescue"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Products = lazy(() => import("@/pages/Products"));
const Sitemap = lazy(() => import("@/pages/Sitemap"));
const Admin = lazy(() => import("@/pages/Admin"));
const About = lazy(() => import("@/pages/About"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/not-found"));

const breedsScrollStore = { position: 0 };

export function saveBreedsScroll() {
  breedsScrollStore.position = window.scrollY;
}

export const breederFinderStore: { position: number; breedSearch: string; selectedBreedSlug: string | null } = {
  position: 0,
  breedSearch: "",
  selectedBreedSlug: null,
};

export function saveBreederFinderState(breedSearch: string, selectedBreedSlug: string | null) {
  breederFinderStore.position = window.scrollY;
  breederFinderStore.breedSearch = breedSearch;
  breederFinderStore.selectedBreedSlug = selectedBreedSlug;
}

function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    const prev = prevLocation.current;
    prevLocation.current = location;

    if (location === "/breeds" && prev.startsWith("/breeds/")) {
      window.scrollTo(0, breedsScrollStore.position);
      return;
    }

    if (location === "/find-a-breeder" && prev.startsWith("/breeds/")) {
      window.scrollTo(0, breederFinderStore.position);
      return;
    }

    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function PageFallback() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/breeds" component={Breeds} />
          <Route path="/breeds/:slug" component={BreedDetail} />
          <Route path="/compare" component={Compare} />
          <Route path="/dog-breed-selector" component={Quiz} />
          <Route path="/dog-breed-selector/results" component={Quiz} />
          <Route path="/ethical-sourcing" component={EthicalSourcing} />
          <Route path="/find-a-breeder" component={FindABreeder} />
          <Route path="/poodle-rescue" component={PoodleRescue} />
          <Route path="/rescue" component={Rescue} />
          <Route path="/rescue/:breedSlug" component={Rescue} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/products" component={Products} />
          <Route path="/sitemap" component={Sitemap} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
