import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productService, authService } from "@/lib/supabase-utils";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const admin = await authService.checkIsAdmin();
    setIsAdmin(admin);
    if (admin) {
      loadProducts();
    } else {
      navigate('/auth');
    }
    setLoading(false);
  };

  const loadProducts = async () => {
    const data = await productService.getProducts();
    setProducts(data);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => { setEditingProduct(null); setShowDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Tabs defaultValue="electronics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="electronics">Electronics</TabsTrigger>
            <TabsTrigger value="furniture">Furniture</TabsTrigger>
          </TabsList>

          {['electronics', 'furniture'].map(section => (
            <TabsContent key={section} value={section}>
              <Card className="p-6">
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-4"
                />
                <div className="space-y-4">
                  {products
                    .filter(p => p.section === section && p.title.toLowerCase().includes(search.toLowerCase()))
                    .map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex gap-4 items-center">
                          {product.images[0] && (
                            <img src={product.images[0]} alt={product.title} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <h3 className="font-semibold">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">{product.category} • ₹{product.price}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingProduct(product); setShowDialog(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            await productService.deleteProduct(product.id);
                            loadProducts();
                            toast({ title: "Product deleted" });
                          }}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
