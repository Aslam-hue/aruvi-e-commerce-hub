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

const FURNITURE_CATEGORIES = [
  "Sofas",
  "Beds",
  "Dining Tables",
  "Chairs",
  "Wardrobes",
  "Study Tables",
  "TV Units",
  "Cabinets",
];

export default function AddFurnitureProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    sub_type: "",
    price: "",
    description: "",
    material: "",
    dimensions: "",
    color: "",
    images: [] as string[],
  });

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
        section: "furniture",
        title: formData.title,
        brand: formData.brand || undefined,
        category: formData.category,
        sub_type: formData.sub_type || undefined,
        price: parseFloat(formData.price),
        description: formData.description || undefined,
        material: formData.material || undefined,
        dimensions: formData.dimensions || undefined,
        color: formData.color || undefined,
        images: formData.images,
        availability: true,
      });

      if (product) {
        toast({
          title: "✨ Product Added!",
          description: "Furniture product created successfully",
        });
        navigate("/admin/furniture/manage");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/furniture")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-amber-400" />
                Add Furniture Product
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
                    placeholder="e.g., Modern L-Shape Sofa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-white">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., IKEA"
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
                    {FURNITURE_CATEGORIES.map((cat) => (
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
                    placeholder="e.g., L-Shape Sofa"
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
                    placeholder="25999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material" className="text-white">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Teak Wood"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions" className="text-white">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., 72x36x32 inches"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-white">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g., Walnut Brown"
                  />
                </div>
              </div>

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
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? "Creating..." : "Create Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/furniture/manage")}
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
