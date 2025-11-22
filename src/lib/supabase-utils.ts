import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// -----------------------------
// PRODUCT SERVICE
// -----------------------------
export const productService = {
  async getProducts(section?: "electronics" | "furniture"): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*");

      if (section) {
        query = query.eq("section", section);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
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
      console.error("Error adding product:", error);
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
      console.error("Error updating product:", error);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },

  // -----------------------------
  // IMAGE STORAGE SUPPORT
  // -----------------------------
  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  },

  async deleteImage(filePath: string): Promise<boolean> {
    try {
      const clean = filePath.split("/").pop();

      const { error } = await supabase.storage
        .from("product-images")
        .remove([clean!]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  },
};

// -----------------------------
// AUTH SERVICE
// -----------------------------
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
      console.error("Error checking admin:", error);
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
