
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sprout, Leaf, FlaskConical, Flower, Shovel } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
    icon: string;
  };
}

// Helper function to render the correct icon based on icon name
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case "Sprout":
      return <Sprout className="h-6 w-6" />;
    case "Leaf":
      return <Leaf className="h-6 w-6" />;
    case "FlaskConical":
      return <FlaskConical className="h-6 w-6" />;
    case "Flower":
      return <Flower className="h-6 w-6" />;
    case "Shovel":
      return <Shovel className="h-6 w-6" />;
    default:
      return <Leaf className="h-6 w-6" />; // Default icon as fallback
  }
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link key={category.id} to={`/market/${category.id}`} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full">
          <div className="h-48 overflow-hidden relative">
            <motion.img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover object-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2 text-white">
              <div className="p-2 bg-foliage rounded-full shadow-lg">
                {renderIcon(category.icon)}
              </div>
              <h3 className="text-xl font-bold drop-shadow-md">{category.name}</h3>
            </div>
          </div>
          <CardContent className="py-4 bg-gradient-to-b from-white to-gray-50">
            <p className="text-gray-600 line-clamp-2">{category.description}</p>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full group hover:bg-foliage hover:border-foliage hover:text-white border-foliage text-foliage transition-colors"
            >
              <span>Explore {category.name}</span>
              <ShoppingCart className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};
