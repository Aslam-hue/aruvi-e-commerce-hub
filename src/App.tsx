import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Electronics Admin
import ElectronicsAdmin from "./pages/admin/electronics";
import AddElectronicsProduct from "./pages/admin/electronics/AddProduct";
import ManageElectronicsProducts from "./pages/admin/electronics/ManageProducts";
import EditElectronicsProduct from "./pages/admin/electronics/EditProduct";

// Furniture Admin
import FurnitureAdmin from "./pages/admin/furniture";
import AddFurnitureProduct from "./pages/admin/furniture/AddProduct";
import ManageFurnitureProducts from "./pages/admin/furniture/ManageProducts";
import EditFurnitureProduct from "./pages/admin/furniture/EditProduct";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/electronics" element={<Shop section="electronics" />} />
            <Route path="/furniture" element={<Shop section="furniture" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/electronics" element={<ElectronicsAdmin />} />
            <Route path="/admin/electronics/add" element={<AddElectronicsProduct />} />
            <Route path="/admin/electronics/manage" element={<ManageElectronicsProducts />} />
            <Route path="/admin/electronics/edit/:id" element={<EditElectronicsProduct />} />
            
            <Route path="/admin/furniture" element={<FurnitureAdmin />} />
            <Route path="/admin/furniture/add" element={<AddFurnitureProduct />} />
            <Route path="/admin/furniture/manage" element={<ManageFurnitureProducts />} />
            <Route path="/admin/furniture/edit/:id" element={<EditFurnitureProduct />} />
            
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
