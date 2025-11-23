import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/lib/supabase-utils";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "../../admin/components/ImageUploader";
import { motion } from "framer-motion";

const categories = [
  "Gas Stove",
  "Pressure Cooker",
  "Mixer Grinder",
  "Wet Grinder",
  "Induction Cooktop",
  "Microwave Oven",
  "Rice Cooker",
  "Toaster",
  "Kettle",
  "Other"
];

export default function AddKitchenProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    model_no: "",
    material: "",
    color: "",
    availability: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one product image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      images,
      section: "kitchen" as const,
    };

    const result = await productService.addProduct(productData);
    
    if (result) {
      toast({
        title: "✅ Success",
        description: "Kitchen appliance added successfully",
      });
      navigate("/admin/kitchen/manage");
    } else {
      toast({
        title: "❌ Error",
        description: "Failed to add kitchen appliance",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/kitchen")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Kitchen Appliance</h1>
            <p className="text-gray-500 mt-1">Add a new product to your kitchen appliances store</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">Product Images</Label>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={6}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Product Name *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Prestige Gas Stove 3 Burner"
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Prestige"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 5999"
                  />
                </div>

                <div>
                  <Label htmlFor="model_no">Model Number</Label>
                  <Input
                    id="model_no"
                    value={formData.model_no}
                    onChange={(e) => setFormData({ ...formData, model_no: e.target.value })}
                    placeholder="e.g., GT-03"
                  />
                </div>

                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g., Stainless Steel"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Silver, Black"
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    value={formData.availability.toString()}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value === "true" })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product description..."
                  rows={4}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/kitchen/manage")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
