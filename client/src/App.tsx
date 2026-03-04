import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Breeds from "@/pages/Breeds";
import BreedDetail from "@/pages/BreedDetail";
import Quiz from "@/pages/Quiz";
import EthicalSourcing from "@/pages/EthicalSourcing";
import Products from "@/pages/Products";
import Sitemap from "@/pages/Sitemap";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/breeds" component={Breeds} />
        <Route path="/breeds/:slug" component={BreedDetail} />
        <Route path="/dog-breed-selector" component={Quiz} />
        <Route path="/ethical-sourcing" component={EthicalSourcing} />
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
