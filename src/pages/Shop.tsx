import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Product, FilterState } from "@/types/product";
import { productService } from "@/lib/supabase-utils";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import electronicsHero from "@/assets/electronics-hero.jpg";
import furnitureHero from "@/assets/furniture-hero.jpg";

interface ShopProps {
  section: 'electronics' | 'furniture';
}

const Shop = ({ section }: ShopProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 200000],
    brand: [],
    material: [],
    color: [],
    search: "",
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [section]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(section);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error loading products",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category.length && !filters.category.includes(product.category)) {
      return false;
    }
    if (filters.brand.length && product.brand && !filters.brand.includes(product.brand)) {
      return false;
    }
    if (filters.material.length && product.material && !filters.material.includes(product.material)) {
      return false;
    }
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    return true;
  });

  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const materials = [...new Set(products.map(p => p.material).filter(Boolean))];

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).includes(value)
        ? (prev[type] as string[]).filter(v => v !== value)
        : [...(prev[type] as string[]), value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 200000],
      brand: [],
      material: [],
      color: [],
      search: "",
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.category.includes(cat)}
                onCheckedChange={() => toggleFilter('category', cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand.includes(brand!)}
                  onCheckedChange={() => toggleFilter('brand', brand!)}
                />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {materials.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Material</h3>
          <div className="space-y-2">
            {materials.map((material) => (
              <div key={material} className="flex items-center gap-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.material.includes(material!)}
                  onCheckedChange={() => toggleFilter('material', material!)}
                />
                <Label htmlFor={`material-${material}`} className="cursor-pointer">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  const heroImage = section === 'electronics' ? electronicsHero : furnitureHero;
  const gradientClass = section === 'electronics' ? 'gradient-electronics' : 'gradient-furniture';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Banner */}
      <div className={`${gradientClass} text-white py-8 md:py-12 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <img src={heroImage} alt={section} className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${section === 'furniture' ? "font-['Playfair_Display']" : ""}`}
          >
            {section === 'electronics' ? 'Electronics Store' : 'Furniture Collection'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg opacity-90"
          >
            {section === 'electronics' 
              ? 'Discover the latest in home electronics'
              : 'Transform your space with premium furniture'}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <FilterContent />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search & Mobile Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl font-semibold mb-2">No products found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
