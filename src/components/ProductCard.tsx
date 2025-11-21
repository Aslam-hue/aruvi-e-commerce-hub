import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Product } from "@/types/product";
import { BuyNowModal } from "./BuyNowModal";
import { Lightbox } from "./Lightbox";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleImageClick = () => {
    setLightboxIndex(currentImageIndex);
    setShowLightbox(true);
  };

  const categoryColor = product.section === 'electronics' 
    ? 'bg-electronics-primary text-white' 
    : 'bg-furniture-primary text-white';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
          <div className="relative aspect-square bg-muted group">
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Zoom Icon Overlay */}
            <div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer"
              onClick={handleImageClick}
            >
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <Badge className={`${categoryColor} w-fit mb-2`}>
              {product.category}
            </Badge>
            
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {product.title}
            </h3>

            <div className="text-sm text-muted-foreground space-y-1 mb-3">
              {product.model_no && <p>Model: {product.model_no}</p>}
              {product.spec_value && product.spec_unit && (
                <p>{product.spec_value} {product.spec_unit}</p>
              )}
              {product.material && <p>Material: {product.material}</p>}
              {product.dimensions && <p>Size: {product.dimensions}</p>}
            </div>

            <div className="mt-auto">
              <p className="text-2xl font-bold text-foreground mb-3">
                ₹{product.price.toLocaleString()}
              </p>
              
              <Button 
                className="w-full"
                onClick={() => setShowBuyModal(true)}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <BuyNowModal
        product={product}
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
      />

      <Lightbox
        images={product.images}
        currentIndex={lightboxIndex}
        open={showLightbox}
        onOpenChange={setShowLightbox}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
};
