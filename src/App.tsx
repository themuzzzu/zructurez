
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarketplaceIndex from './pages/marketplace';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/search';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import BusinessDetails from './pages/BusinessDetails';
import OptimizedMarketplace from './pages/marketplace/OptimizedMarketplace';
import BusinessesPage from "./pages/BusinessesPage";
import Index from './pages/Index';

// Define placeholder components for missing pages
const PlaceholderPage = ({ pageName }: { pageName: string }) => (
  <div className="container mx-auto p-8">
    <h1 className="text-2xl font-bold mb-4">{pageName}</h1>
    <p>This page is under construction.</p>
  </div>
);

const Home = () => <PlaceholderPage pageName="Home" />;
const CategoryPage = () => <PlaceholderPage pageName="Category Page" />;
const CheckoutPage = () => <PlaceholderPage pageName="Checkout Page" />;
const LoginPage = () => <PlaceholderPage pageName="Login Page" />;
const RegisterPage = () => <PlaceholderPage pageName="Register Page" />;
const ProfilePage = () => <PlaceholderPage pageName="Profile Page" />;
const CreateProduct = () => <PlaceholderPage pageName="Create Product" />;
const EditProduct = () => <PlaceholderPage pageName="Edit Product" />;
const CreateService = () => <PlaceholderPage pageName="Create Service" />;
const EditService = () => <PlaceholderPage pageName="Edit Service" />;
const CreateBusiness = () => <PlaceholderPage pageName="Create Business" />;
const EditBusiness = () => <PlaceholderPage pageName="Edit Business" />;

const routes = [
  { path: "/", element: <Index /> },
  { path: "/marketplace", element: <OptimizedMarketplace /> },
  { path: "/products/:id", element: <ProductDetails /> },
  { path: "/categories/:category", element: <CategoryPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/create-product", element: <CreateProduct /> },
  { path: "/edit-product/:id", element: <EditProduct /> },
  { path: "/search", element: <Search /> },
  { path: "/services", element: <Services /> },
  { path: "/services/:id", element: <ServiceDetails /> },
  { path: "/create-service", element: <CreateService /> },
  { path: "/edit-service/:id", element: <EditService /> },
  { path: "/businesses/:id", element: <BusinessDetails /> },
  { path: "/create-business", element: <CreateBusiness /> },
  { path: "/edit-business/:id", element: <EditBusiness /> },
  { path: "/businesses", element: <BusinessesPage /> },
];

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
