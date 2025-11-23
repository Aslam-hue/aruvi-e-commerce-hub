import { useState, useMemo } from "react";
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

/**
 * AddFurnitureProduct (fully-featured)
 *
 * Features:
 * - Multi-image upload (converts base64 -> File -> uploads via productService.uploadImages)
 * - Category -> Subcategory dynamic mapping (extendable)
 * - Client-side validation with friendly toasts
 * - Auto slug generation from title
 * - Improved UI with Framer Motion touches
 * - Previews + remove before upload (delegated to ImageUploader)
 * - Ready for Edit support (keeps images array as previews or URLs)
 */

// Example subcategory mapping — extend as needed
const SUBCATEGORY_MAP: Record<string, string[]> = {
  Sofas: ["L-Shape Sofa", "3-Seater Sofa", "Recliner Sofa", "2-Seater Sofa"],
  Beds: ["King Size", "Queen Size", "Single Bed", "Bunk Bed"],
  "Dining Tables": ["4-Seater", "6-Seater", "Extendable"],
  Chairs: ["Dining Chair", "Recliner Chair", "Office Chair"],
  Wardrobes: ["2-Door", "3-Door", "Sliding Door"],
  "Study Tables": ["Single Desk", "Computer Desk"],
  "TV Units": ["Wall-mounted", "Cabinet"],
  Cabinets: ["Storage Cabinet", "Display Cabinet"],
};

export default function AddFurnitureProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    brand: "",
    category: "",
    sub_type: "",
    price: "",
    description: "",
    material: "",
    dimensions: "",
    color: "",
    // images holds base64 previews returned by ImageUploader || (in some flows) existing URLs
    images: [] as string[],
  });

  // validation errors local (for UI, not required)
  const [errors, setErrors] = useState<Record<string, string>>({});

  // derived list of subcategories for selected category
  const subcategories = useMemo(() => {
    return formData.category ? SUBCATEGORY_MAP[formData.category] || [] : [];
  }, [formData.category]);

  // ---------- helpers ----------

  // slug generator
  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .replace(/\s+/g, "-") // spaces -> hyphen
      .replace(/-+/g, "-"); // remove repeated hyphens

  // convert base64 preview -> File
  const base64ToFile = async (base64: string, filename: string) => {
    // fetch works with data urls
    const res = await fetch(base64);
    const blob = await res.blob();
    // determine extension from mime type if possible
    const ext = blob.type.split("/")[1] || "jpg";
    return new File([blob], `${filename}.${ext}`, { type: blob.type });
  };

  // validate fields, return boolean
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = "Product title is required";
    if (!formData.category) e.category = "Please select a category";
    if (!formData.price || isNaN(Number(formData.price))) e.price = "Valid price required";
    if (!formData.images || formData.images.length < 1) e.images = "Upload at least 1 image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // convert all base64 previews to File[] and upload via productService.uploadImages
  const uploadAllImages = async (): Promise<string[]> => {
    // If images array already contains real URLs (starting with http), skip conversion for those
    const base64Items = formData.images.filter((i) => i.startsWith("data:"));
    const urlItems = formData.images.filter((i) => !i.startsWith("data:"));

    const files: File[] = [];
    for (let i = 0; i < base64Items.length; i++) {
      const file = await base64ToFile(base64Items[i], `furniture-${Date.now()}-${i}`);
      files.push(file);
    }

    // If there are no files to upload, return existing URLs only
    if (files.length === 0) return urlItems;

    // productService.uploadImages(files) -> returns array of URLs
    const uploadedUrls = await productService.uploadImages(files);
    // return concat of already-existing URLs and newly uploaded
    return [...urlItems, ...uploadedUrls];
  };

  // ---------- submit handler ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      toast({
        title: "Please fix the highlighted fields",
        description: "Some required fields are missing or invalid",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // generate slug and set locally
      const slug = generateSlug(formData.title);
      setFormData((p) => ({ ...p, slug }));

      // upload images (converts base64 -> file etc)
      const imageUrls = await uploadAllImages();
      if (!imageUrls || imageUrls.length < 1) {
        throw new Error("Image upload failed");
      }

      // build product payload (only fields you want)
      const payload = {
        section: "furniture" as const,
        title: formData.title,
        slug,
        brand: formData.brand || undefined,
        category: formData.category,
        sub_type: formData.sub_type || undefined,
        price: Number(formData.price),
        description: formData.description || undefined,
        material: formData.material || undefined,
        dimensions: formData.dimensions || undefined,
        color: formData.color || undefined,
        images: imageUrls,
        availability: true,
      };

      // call addProduct
      const created = await productService.addProduct(payload);

      if (!created) throw new Error("Product creation failed");

      toast({
        title: "✨ Product Added",
        description: "Furniture product created successfully",
      });

      // navigate to manage page
      navigate("/admin/furniture/manage");
    } catch (err: any) {
      console.error("Add product error:", err);
      toast({
        title: "❌ Error",
        description: err?.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
              <p className="text-gray-400 mt-1">Create a new product listing — be descriptive to help buyers</p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-white">Product Images *</Label>
                <p className="text-xs text-gray-400 mb-2">Add clear images: front, side, close-up, dimensions. Max 10 images.</p>

                <ImageUploader
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={10}
                />
                {errors.images && <p className="text-sm text-red-400 mt-1">{errors.images}</p>}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Product Name *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    onBlur={(e) => setFormData((p) => ({ ...p, slug: generateSlug(e.target.value) }))}
                    placeholder="e.g., Modern L-Shape Sofa"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-white">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                    placeholder="e.g., IKEA"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value, sub_type: "" }))
                    }
                    className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white"
                  >
                    <option value="">Select category</option>
                    {Object.keys(SUBCATEGORY_MAP).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-400">{errors.category}</p>}
                </div>

                {/* Subcategory dropdown (populated from map) */}
                <div className="space-y-2">
                  <Label htmlFor="sub_type" className="text-white">Sub-Category</Label>
                  <select
                    id="sub_type"
                    value={formData.sub_type}
                    onChange={(e) => setFormData((p) => ({ ...p, sub_type: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white"
                    disabled={!subcategories.length}
                  >
                    <option value="">{subcategories.length ? "Select sub-category" : "Choose a category first"}</option>
                    {subcategories.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="e.g., 25999"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  {errors.price && <p className="text-sm text-red-400">{errors.price}</p>}
                </div>

                {/* Material */}
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-white">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData((p) => ({ ...p, material: e.target.value }))}
                    placeholder="e.g., Teak Wood"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-2">
                  <Label htmlFor="dimensions" className="text-white">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData((p) => ({ ...p, dimensions: e.target.value }))}
                    placeholder="e.g., 72x36x32 inches"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-white">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                    placeholder="e.g., Walnut Brown"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed product description..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-32"
                />
              </div>

              {/* Buttons */}
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

