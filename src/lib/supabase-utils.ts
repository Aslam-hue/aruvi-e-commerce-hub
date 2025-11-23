import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// ---------------------------------------------------
// IMAGE UPLOAD HELPERS
// ---------------------------------------------------
async function uploadSingleImage(file: File): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("❌ Error uploading one image:", error);
    return null;
  }
}

// Upload MULTIPLE images
async function uploadImages(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const f of files) {
    const url = await uploadSingleImage(f);
    if (url) uploadedUrls.push(url);
  }

  return uploadedUrls;
}

// Delete image
async function deleteImage(url: string): Promise<boolean> {
  try {
    const clean = url.split("/").pop();
    const { error } = await supabase.storage
      .from("product-images")
      .remove([clean!]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    return false;
  }
}

// ---------------------------------------------------
// PRODUCT SERVICE
// ---------------------------------------------------
export const productService = {
  async getProducts(section?: "electronics" | "furniture"): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*");

      if (section) query = query.eq("section", section);

      const { data, error } = await query;
      if (error) throw error;

      return (data || []) as Product[];
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    } catch (error) {
      console.error("❌ Error fetching product by ID:", error);
      return null;
    }
  },

  async addProduct(
    product: Omit<Product, "id" | "created_at" | "updated_at">
  ): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error("❌ Error adding product:", error);
      return null;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error("❌ Error updating product:", error);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      return false;
    }
  },

  // Expose image helpers
  uploadImages,
  deleteImage,
};

// ---------------------------------------------------
// AUTH SERVICE
// ---------------------------------------------------
export const authService = {
  async checkIsAdmin(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      return !!data;
    } catch (error) {
      console.error("❌ Error checking admin:", error);
      return false;
    }
  },

  signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  signUp(email: string, password: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
  },

  signOut() {
    return supabase.auth.signOut();
  },
};
