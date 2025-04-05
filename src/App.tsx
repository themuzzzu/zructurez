import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { NotFound } from "@/components/NotFound";
import { Auth } from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { Shopping } from "@/pages/Shopping";
import { ProductDetails } from "@/pages/ProductDetails";
import { Post } from "@/pages/Post";
import { PostDetails } from "@/pages/PostDetails";
import { Marketplace } from "@/pages/Marketplace";
import { Wishlist } from "@/pages/Wishlist";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import {
  SessionContextProvider,
  Session,
  useSessionContext,
} from "supabase-hooks-nextjs";
import { supabase } from "@/integrations/supabase/client";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Dashboard } from "@/pages/Dashboard";
import { CreatePost } from "@/pages/CreatePost";
import { EditPost } from "@/pages/EditPost";
import MarketplaceSearch from "./pages/marketplace/search";

const AppContent = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Redirect to /auth if not logged in and trying to access /profile
  useEffect(() => {
    const publicRoutes = ["/", "/about", "/contact", "/auth", "/terms", "/privacy"];
    const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"];

    const isPublicRoute = publicRoutes.includes(location.pathname);
    const isAuthRoute = authRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (!session && location.pathname === "/profile") {
      navigate("/auth");
    }

    if (session && isAuthRoute) {
      navigate("/");
    }
  }, [session, location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/shopping" element={<Shopping />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/post" element={<Post />} />
      <Route path="/post/:postId" element={<PostDetails />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/edit-post/:postId" element={<EditPost />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/marketplace/search" element={<MarketplaceSearch />} />
    </Routes>
  );
};

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </SessionContextProvider>
  );
}

export default App;
