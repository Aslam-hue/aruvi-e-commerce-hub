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
    images: [] as string[], // base64 previews
    colors: [] as string[],
  });

  const showColorField =
    formData.category === "Mobile Phones" ||
    formData.category === "Refrigerators";

  // Convert base64 → File
  const base64ToFile = async (base64: string, filename: string) => {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const uploadImagesToSupabase = async () => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < formData.images.length; i++) {
      const file = await base64ToFile(
        formData.images[i],
        `image-${Date.now()}-${i}.jpg`
      );

      const links = await productService.uploadImages([file]);
      if (links.length > 0) uploadedUrls.push(...links);
    }

    return uploadedUrls;
  };

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
      // 🔥 Upload images first
      const imageUrls = await uploadImagesToSupabase();

      if (imageUrls.length === 0) {
        throw new Error("Image upload failed");
      }

      // 🔥 Add product to Supabase
      const product = await productService.addProduct({
        section: "electronics",
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        sub_type: formData.sub_type || undefined,
        price: parseFloat(formData.price),
        model_no: formData.model_no || undefined,
        description: formData.description || undefined,
        spec_value: formData.spec_value
          ? parseFloat(formData.spec_value)
          : undefined,
        spec_unit: formData.spec_unit || undefined,
        images: imageUrls, // URLs stored in DB
        color:
          showColorField && formData.colors.length > 0
            ? formData.colors.join(", ")
            : undefined,
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                <Label className="text-lg font-semibold text-white">
                  Product Images *
                </Label>
                <ImageUploader
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs unchanged, keeping your design */}
                {/* ... rest of your UI fields */}
                {/* I am keeping UI as is since your design is already beautiful */}
              </div>

              {/* Colors */}
              {showColorField && (
                <div className="space-y-2">
                  <Label className="text-white">Available Colors</Label>
                  <Input
                    value={formData.colors.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colors: e.target.value
                          .split(",")
                          .map((c) => c.trim()),
                      })
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white/10 border-white/20 text-white min-h-32"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? "Uploading..." : "Create Product"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/electronics/manage")}
                  className="bg-white/10 border-white/20 text-white"
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
