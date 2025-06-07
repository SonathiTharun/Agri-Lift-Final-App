
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  product: {
    name: string;
    image: string;
    images?: string[];
  };
}

export const ProductImageCarousel = ({ product }: ProductImageCarouselProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main Image or Carousel */}
      <div className="aspect-square rounded-xl overflow-hidden border bg-white shadow-md">
        {product.images && product.images.length > 0 ? (
          <Carousel>
            <CarouselContent>
              {product.images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="h-full w-full flex items-center justify-center p-2">
                    <img 
                      src={img} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/80 backdrop-blur-sm border-0 hover:bg-foliage hover:text-white" />
            <CarouselNext className="bg-white/80 backdrop-blur-sm border-0 hover:bg-foliage hover:text-white" />
          </Carousel>
        ) : (
          <div className="h-full w-full flex items-center justify-center p-2">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>
      
      {/* Thumbnail Images */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {product.images.map((img, idx) => (
            <motion.div 
              key={idx}
              className={`h-20 w-20 flex-shrink-0 rounded-lg border overflow-hidden cursor-pointer 
                ${selectedImage === idx ? 'ring-2 ring-foliage' : ''}`}
              onClick={() => setSelectedImage(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${idx + 1}`} 
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
