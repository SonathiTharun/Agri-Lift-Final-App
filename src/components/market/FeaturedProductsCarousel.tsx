
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { FeaturedProductCard } from "./FeaturedProductCard";

interface FeaturedProductsCarouselProps {
  featuredProducts: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    discount?: number;
    categoryId: string;
  }>;
}

export const FeaturedProductsCarousel = ({ featuredProducts }: FeaturedProductsCarouselProps) => {
  return (
    <motion.div 
      className="my-12 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1.5 h-8 bg-foliage rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
        </div>
        <Link to="/market" className="text-foliage hover:underline flex items-center font-medium">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {featuredProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
              <FeaturedProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static transform-none bg-white border-gray-200 hover:bg-foliage hover:text-white hover:border-foliage transition-colors" />
          <CarouselNext className="static transform-none bg-white border-gray-200 hover:bg-foliage hover:text-white hover:border-foliage transition-colors" />
        </div>
      </Carousel>
    </motion.div>
  );
};
