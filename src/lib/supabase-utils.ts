import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const productService = {
  async getProducts(section?: 'electronics' | 'furniture'): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('availability', true);
      
      if (section) {
        query = query.eq('section', section);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },
};

export const authService = {
  async checkIsAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },
};
