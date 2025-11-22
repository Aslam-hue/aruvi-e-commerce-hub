import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
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

export default function AddElectronicsProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
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

  const showColorField = formData.category === "Mobile Phones" || formData.category === "Refrigerators";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length < 1) {
      toast({
        title: "❌ Images Required",
        description: "Please upload at least 1 product image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const product = await productService.addProduct({
        section: "electronics",
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
        availability: true,
      });

      if (product) {
        toast({
          title: "✨ Product Added!",
          description: "Electronics product created successfully",
        });
        navigate("/admin/electronics/manage");
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              onClick={() => navigate("/admin/electronics")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-blue-400" />
                Add Electronics Product
              </h1>
              <p className="text-gray-400 mt-1">Create a new product listing</p>
            </div>
          </div>

          {/* Form */}
          <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-white">Product Images *</Label>
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Samsung Galaxy S24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-white">Brand *</Label>
                  <Input
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Samsung"
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Smartphone"
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="49999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model_no" className="text-white">Model Number</Label>
                  <Input
                    id="model_no"
                    value={formData.model_no}
                    onChange={(e) => setFormData({ ...formData, model_no: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., SM-S921B"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spec_value" className="text-white">Specification Value</Label>
                  <Input
                    id="spec_value"
                    type="number"
                    value={formData.spec_value}
                    onChange={(e) => setFormData({ ...formData, spec_value: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., 6.2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spec_unit" className="text-white">Specification Unit</Label>
                  <Input
                    id="spec_unit"
                    value={formData.spec_unit}
                    onChange={(e) => setFormData({ ...formData, spec_unit: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., inches, GB, MP"
                  />
                </div>
              </div>

              {/* Colors - Only for Mobile Phones & Refrigerators */}
              {showColorField && (
                <div className="space-y-2">
                  <Label htmlFor="colors" className="text-white">Available Colors</Label>
                  <Input
                    id="colors"
                    value={formData.colors.join(", ")}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(",").map(c => c.trim()) })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Black, White, Blue (comma separated)"
                  />
                  <p className="text-xs text-gray-400">Separate colors with commas</p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-32"
                  placeholder="Detailed product description..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? "Creating..." : "Create Product"}
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
