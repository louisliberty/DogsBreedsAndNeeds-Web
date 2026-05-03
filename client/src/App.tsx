import { useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Breeds from "@/pages/Breeds";
import BreedDetail from "@/pages/BreedDetail";
import Compare from "@/pages/Compare";
import Quiz from "@/pages/Quiz";
import EthicalSourcing from "@/pages/EthicalSourcing";
import FindABreeder from "@/pages/FindABreeder";
import PoodleRescue from "@/pages/PoodleRescue";
import Products from "@/pages/Products";
import Sitemap from "@/pages/Sitemap";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

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

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/breeds" component={Breeds} />
        <Route path="/breeds/:slug" component={BreedDetail} />
        <Route path="/compare" component={Compare} />
        <Route path="/dog-breed-selector" component={Quiz} />
        <Route path="/ethical-sourcing" component={EthicalSourcing} />
        <Route path="/find-a-breeder" component={FindABreeder} />
        <Route path="/poodle-rescue" component={PoodleRescue} />
        <Route path="/products" component={Products} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
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
