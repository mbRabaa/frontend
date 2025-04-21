
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/Index";
import TrajetsPage from "./pages/Trajets";
import ReservationPage from "./pages/Reservations";
import PaiementPage from "./pages/Paiements";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/trajets" element={<Layout><TrajetsPage /></Layout>} />
          <Route path="/reservations" element={<Layout><ReservationPage /></Layout>} />
          <Route path="/paiements" element={<Layout><PaiementPage /></Layout>} />
          <Route path="/a-propos" element={<Layout><AboutPage /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
