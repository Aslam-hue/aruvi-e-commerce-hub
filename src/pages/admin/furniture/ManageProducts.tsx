import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/lib/supabase-utils";
import { Product } from "@/types/product";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { motion } from "framer-motion";

export default function ManageFurnitureProducts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getProducts("furniture");
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const success = await productService.deleteProduct(deleteId);
    if (success) {
      toast({ title: "✅ Product Deleted", description: "Product removed successfully" });
      loadProducts();
    } else {
      toast({ title: "❌ Error", description: "Failed to delete product", variant: "destructive" });
    }
    setDeleteId(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                         p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-black py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-white">Furniture Products</h1>
                <p className="text-gray-400 mt-1">{filteredProducts.length} products found</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/admin/furniture/add")}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Filters */}
          <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white"
              >
                <option value="" className="bg-gray-900">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent"></div>
              <p className="text-white mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-12 text-center">
              <p className="text-gray-400 text-lg">No products found</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group backdrop-blur-xl bg-white/5 border-white/10 hover:border-amber-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-amber-500/20">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-amber-400 transition-colors">
                          {product.title}
                        </h3>
                        {product.material && (
                          <p className="text-sm text-gray-400">{product.material}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amber-400">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.color && (
                          <span className="text-xs text-gray-500">{product.color}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-amber-600 hover:border-amber-600"
                          onClick={() => navigate(`/admin/furniture/edit/${product.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        description="This action cannot be undone. The product will be permanently deleted."
      />
    </div>
  );
}
