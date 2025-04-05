
import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import MarketplaceSearch from "./pages/marketplace/search";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

// Creating a simple placeholder component for missing components
const PlaceholderPage = ({ title }: { title: string }) => (
  <Layout>
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold">{title} Page</h1>
      <p className="mt-4">This is a placeholder for the {title} page.</p>
    </div>
  </Layout>
);

// Define placeholder components for all missing pages
const Home = () => <PlaceholderPage title="Home" />;
const About = () => <PlaceholderPage title="About" />;
const Contact = () => <PlaceholderPage title="Contact" />;
const Auth = () => <PlaceholderPage title="Authentication" />;
const Profile = () => <PlaceholderPage title="Profile" />;
const Shopping = () => <PlaceholderPage title="Shopping" />;
const ProductDetails = () => <PlaceholderPage title="Product Details" />;
const Post = () => <PlaceholderPage title="Post" />;
const PostDetails = () => <PlaceholderPage title="Post Details" />;
const Marketplace = () => <PlaceholderPage title="Marketplace" />;
const Wishlist = () => <PlaceholderPage title="Wishlist" />;
const Terms = () => <PlaceholderPage title="Terms" />;
const Privacy = () => <PlaceholderPage title="Privacy" />;
const Dashboard = () => <PlaceholderPage title="Dashboard" />;
const CreatePost = () => <PlaceholderPage title="Create Post" />;
const EditPost = () => <PlaceholderPage title="Edit Post" />;

// Create a simple ScrollToTop component to replace the missing import
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Create a SessionContextProvider replacement
interface SessionContextProviderProps {
  supabaseClient: any;
  children: React.ReactNode;
}

// Define Session type
type Session = {
  user: any;
  access_token?: string;
};

const SessionContextProvider = ({ children }: SessionContextProviderProps) => {
  return <>{children}</>;
};

const AppContent = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Simplified session check since we're just creating placeholders
    const checkSession = async () => {
      // No actual session check for now
    };
    checkSession();
  }, []);

  // Redirect to /auth if not logged in and trying to access /profile
  useEffect(() => {
    const publicRoutes = [
      "/",
      "/about",
      "/contact",
      "/auth",
      "/terms",
      "/privacy"
    ];
    const authRoutes = [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/forgot-password"
    ];

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
      <Route path="*" element={<PlaceholderPage title="Not Found" />} />
      <Route path="/marketplace/search" element={<MarketplaceSearch />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={{}}>
        <ScrollToTop />
        <AppContent />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
