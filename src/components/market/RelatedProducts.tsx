
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface RelatedProductsProps {
  relatedProducts: Product[];
  categoryId?: string;
  navigate: (path: string) => void;
}

const RelatedProductCard = ({ product, categoryId, navigate }: {
  product: Product;
  categoryId?: string;
  navigate: (path: string) => void;
}) => {
  return (
    <motion.div 
      className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/market/${categoryId}/${product.id}`)}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-foliage">₹{product.price}</span>
          <div className="flex items-center">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="ml-1 text-xs text-gray-600">{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const RelatedProducts = ({ relatedProducts, categoryId, navigate }: RelatedProductsProps) => {
  if (relatedProducts.length === 0) return null;

  return (
    <motion.div 
      className="mt-16" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1.5 h-6 bg-foliage rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
        </div>
        <Button variant="ghost" className="text-foliage font-medium" onClick={() => navigate(`/market/${categoryId}`)}>
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map(relatedProduct => (
          <RelatedProductCard 
            key={relatedProduct.id}
            product={relatedProduct}
            categoryId={categoryId}
            navigate={navigate}
          />
        ))}
      </div>
    </motion.div>
  );
};
