import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Using shadcn's Sonner for rich notifications
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Pages
import HomePage from "./pages/HomePage";
import SearchAndResultsPage from "./pages/SearchAndResultsPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

// A simple placeholder Login page for the /login route redirection from ProfilePage logout
const LoginPagePlaceholder = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Login Page</h1>
    <p>This is a placeholder for the login page.</p>
    <a href="/">Go to Home</a>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchAndResultsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Placeholder Login Route for logout redirect example */}
          <Route path="/login" element={<LoginPagePlaceholder />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster /> {/* For shadcn/ui toast (used by MenuItemCard) */}
      <Sonner /> {/* For shadcn/ui sonner (rich notifications) */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;