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

export default function EditFurnitureProduct() {
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
    description: "",
    material: "",
    dimensions: "",
    color: "",
    images: [] as string[],
  });

  /** 🔥 Load single product by ID */
  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);

    const product = await productService.getProductById(id);

    if (!product) {
      toast({
        title: "❌ Product Not Found",
        variant: "destructive",
      });
      navigate("/admin/furniture/manage");
      return;
    }

    setFormData({
      title: product.title || "",
      brand: product.brand || "",
      category: product.category || "",
      sub_type: product.sub_type || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      material: product.material || "",
      dimensions: product.dimensions || "",
      color: product.color || "",
      images: product.images || [],
    });

    setLoading(false);
  };

  /** 🔥 Save product */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (formData.images.length < 1) {
      toast({
        title: "❌ Images Required",
        description: "Upload at least 1 image",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const updated = await productService.updateProduct(id, {
      title: formData.title,
      brand: formData.brand || null,
      category: formData.category,
      sub_type: formData.sub_type || null,
      price: parseFloat(formData.price),
      description: formData.description || null,
      material: formData.material || null,
      dimensions: formData.dimensions || null,
      color: formData.color || null,
      images: formData.images,
    });

    if (!updated) {
      toast({
        title: "❌ Update Failed",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    toast({
      title: "✨ Product Updated!",
      description: "Changes saved successfully",
    });

    navigate("/admin/furniture/manage");
  };

  /** Loading Screen */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-amber-500 mx-auto" />
          <p className="text-white mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/furniture/manage")}
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
                <ImageUploader
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <Label className="text-white">Product Name *</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Brand</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Category *</Label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white"
                  >
                    <option value="">Select category</option>
                    {FURNITURE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Sub-Category</Label>
                  <Input
                    value={formData.sub_type}
                    onChange={(e) => setFormData({ ...formData, sub_type: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Price (₹) *</Label>
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Material</Label>
                  <Input
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Dimensions</Label>
                  <Input
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Color</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white min-h-32"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
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

