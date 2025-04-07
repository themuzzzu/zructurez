
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LoadingView } from "@/components/LoadingView";
import { NotFound } from "@/components/NotFound";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Profile = lazy(() => import("@/pages/Profile"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const Businesses = lazy(() => import("@/pages/Businesses"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingView />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
