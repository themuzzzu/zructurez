import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import MarketplaceIndex from './pages/marketplace';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Search from './pages/search';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';
import BusinessDetails from './pages/BusinessDetails';
import CreateBusiness from './pages/CreateBusiness';
import EditBusiness from './pages/EditBusiness';
import OptimizedMarketplace from './pages/marketplace/OptimizedMarketplace';
import BusinessesPage from "./pages/BusinessesPage";

const routes = [
  { path: "/", element: <Home /> },
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
