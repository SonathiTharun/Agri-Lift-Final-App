
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export const CallToAction = () => {
  return (
    <motion.div 
      className="mt-20 text-center max-w-3xl mx-auto p-10 rounded-2xl bg-gradient-to-r from-foliage/10 to-sky/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Farming Productivity?</h2>
      <p className="text-gray-600 mb-6 text-lg">Join thousands of farmers who have improved their yields with our premium products</p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button size="lg" className="bg-foliage hover:bg-foliage-dark text-white px-8 py-6 text-lg shadow-lg">
          Shop Now <ShoppingCart className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
