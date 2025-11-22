import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/lib/supabase-utils";
import { ImageUploader } from "../components/ImageUploader";
import { motion } from "framer-motion";

const ELECTRONICS_CATEGORIES = [
  "Mobile Phones",
  "Laptops",
  "Televisions",
  "Air Conditioners",
  "Refrigerators",
  "Washing Machines",
  "Cameras",
  "Headphones",
];

export default function EditElectronicsProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    sub_type: "",
    price: "",
    model_no: "",
    description: "",
    spec_value: "",
    spec_unit: "",
    images: [] as string[],
    colors: [] as string[],
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    const products = await productService.getProducts("electronics");
    const product = products.find(p => p.id === id);
    
    if (product) {
      setFormData({
        title: product.title,
        brand: product.brand || "",
        category: product.category,
        sub_type: product.sub_type || "",
        price: product.price.toString(),
        model_no: product.model_no || "",
        description: product.description || "",
        spec_value: product.spec_value?.toString() || "",
        spec_unit: product.spec_unit || "",
        images: product.images || [],
        colors: product.color ? product.color.split(", ") : [],
      });
    } else {
      toast({
        title: "❌ Product Not Found",
        variant: "destructive",
      });
      navigate("/admin/electronics/manage");
    }
    setLoading(false);
  };

  const showColorField = formData.category === "Mobile Phones" || formData.category === "Refrigerators";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    if (formData.images.length < 1) {
      toast({
        title: "❌ Images Required",
        description: "Please upload at least 1 product image",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const product = await productService.updateProduct(id, {
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        sub_type: formData.sub_type || undefined,
        price: parseFloat(formData.price),
        model_no: formData.model_no || undefined,
        description: formData.description || undefined,
        spec_value: formData.spec_value ? parseFloat(formData.spec_value) : undefined,
        spec_unit: formData.spec_unit || undefined,
        images: formData.images,
        color: showColorField && formData.colors.length > 0 ? formData.colors.join(", ") : undefined,
      });

      if (product) {
        toast({
          title: "✨ Product Updated!",
          description: "Changes saved successfully",
        });
        navigate("/admin/electronics/manage");
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-white mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/electronics/manage")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white">Edit Product</h1>
              <p className="text-gray-400 mt-1">Update product details</p>
            </div>
          </div>

          {/* Form */}
          <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-white">Product Images *</Label>
                <p className="text-sm text-gray-400">Remove old images and upload new ones as needed</p>
                <ImageUploader
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Product Name *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-white">Brand *</Label>
                  <Input
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white"
                  >
                    <option value="" className="bg-gray-900">Select category</option>
                    {ELECTRONICS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_type" className="text-white">Sub-Category</Label>
                  <Input
                    id="sub_type"
                    value={formData.sub_type}
                    onChange={(e) => setFormData({ ...formData, sub_type: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model_no" className="text-white">Model Number</Label>
                  <Input
                    id="model_no"
                    value={formData.model_no}
                    onChange={(e) => setFormData({ ...formData, model_no: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spec_value" className="text-white">Specification Value</Label>
                  <Input
                    id="spec_value"
                    type="number"
                    value={formData.spec_value}
                    onChange={(e) => setFormData({ ...formData, spec_value: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spec_unit" className="text-white">Specification Unit</Label>
                  <Input
                    id="spec_unit"
                    value={formData.spec_unit}
                    onChange={(e) => setFormData({ ...formData, spec_unit: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Colors */}
              {showColorField && (
                <div className="space-y-2">
                  <Label htmlFor="colors" className="text-white">Available Colors</Label>
                  <Input
                    id="colors"
                    value={formData.colors.join(", ")}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(",").map(c => c.trim()) })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Black, White, Blue"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white min-h-32"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/electronics/manage")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
