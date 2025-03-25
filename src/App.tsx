
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Index from "@/pages/Index";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import SearchPage from "@/pages/search";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/search" element={<SearchPage />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
