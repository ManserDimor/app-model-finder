import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Auth from "./pages/Auth";
import Channel from "./pages/Channel";
import Search from "./pages/Search";
import History from "./pages/History";
import Liked from "./pages/Liked";
import Subscriptions from "./pages/Subscriptions";
import Upload from "./pages/Upload";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/search" element={<Search />} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
