import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productService } from "@/lib/supabase-utils";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Access granted" });
    } else {
      toast({ 
        title: "Access denied", 
        description: "Incorrect password",
        variant: "destructive" 
      });
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-electronics-bg via-background to-furniture-bg relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          {/* Glassmorphism Card */}
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 shadow-2xl p-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-electronics-primary to-furniture-primary flex items-center justify-center shadow-lg">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
              <p className="text-muted-foreground">Enter password to continue</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12 bg-white/50 backdrop-blur-sm border-white/30 text-lg py-6"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-electronics-primary to-furniture-primary hover:opacity-90 transition-opacity"
              >
                <Lock className="mr-2 h-5 w-5" />
                Unlock Admin Panel
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-electronics-bg via-background to-furniture-bg py-8">
      {/* Glassmorphism Container */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
            <Button 
              onClick={() => { 
                toast({ title: "Feature coming soon", description: "Product addition will be available shortly" }); 
              }}
              className="bg-gradient-to-r from-electronics-primary to-furniture-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <Tabs defaultValue="electronics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="electronics" className="data-[state=active]:bg-electronics-primary data-[state=active]:text-white">
                Electronics
              </TabsTrigger>
              <TabsTrigger value="furniture" className="data-[state=active]:bg-furniture-primary data-[state=active]:text-white">
                Furniture
              </TabsTrigger>
            </TabsList>

            {['electronics', 'furniture'].map(section => (
              <TabsContent key={section} value={section}>
                <Card className="backdrop-blur-sm bg-white/40 border-white/30 p-4 md:p-6">
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-6 bg-white/50 backdrop-blur-sm border-white/30"
                  />
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading products...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products
                        .filter(p => p.section === section && p.title.toLowerCase().includes(search.toLowerCase()))
                        .map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-white/20 rounded-xl backdrop-blur-sm bg-white/30 hover:bg-white/50 transition-colors gap-4"
                          >
                            <div className="flex gap-4 items-center flex-1 w-full sm:w-auto">
                              {product.images[0] && (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.title} 
                                  className="w-16 h-16 object-cover rounded-lg shadow-md flex-shrink-0" 
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold truncate">{product.title}</h3>
                                <p className="text-sm text-muted-foreground">{product.category} • ₹{product.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => toast({ title: "Edit feature coming soon" })}
                                className="flex-1 sm:flex-initial bg-white/50 backdrop-blur-sm border-white/30"
                              >
                                <Edit className="h-4 w-4 sm:mr-0 md:mr-2" />
                                <span className="hidden md:inline">Edit</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={async () => {
                                  await productService.deleteProduct(product.id);
                                  loadProducts();
                                  toast({ title: "Product deleted" });
                                }}
                                className="flex-1 sm:flex-initial"
                              >
                                <Trash className="h-4 w-4 sm:mr-0 md:mr-2" />
                                <span className="hidden md:inline">Delete</span>
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      
                      {products.filter(p => p.section === section && p.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No products found</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
