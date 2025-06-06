
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ChevronRight, 
  Filter,
  Grid2X2,
  LayoutList,
  SlidersHorizontal
} from "lucide-react";
import { productsByCategory } from "@/data/marketData";
import { motion } from "framer-motion";

const ProductCard = ({ product, categoryId }) => {
  return (
    <Link key={product.id} to={`/market/${categoryId}/${product.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="h-48 overflow-hidden relative">
            {product.discount && (
              <Badge className="absolute top-2 right-2 bg-red-500 border-0 z-10">
                -{product.discount}%
              </Badge>
            )}
            <motion.img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <CardContent className="py-4 bg-gradient-to-b from-white to-gray-50">
            <h3 className="font-semibold text-lg text-soil-dark truncate">{product.name}</h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-foliage-dark font-bold text-lg">₹{product.price}</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm">
                  ₹{Math.round(product.price * (1 + product.discount / 100))}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100">
            <Button variant="outline" className="w-full group hover:bg-foliage hover:text-white border-foliage text-foliage">
              <span>View Details</span>
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default function ProductCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 300);
  }, [categoryId]);

  // Get category name for display
  const getCategoryName = (catId: string = "") => {
    const categoryMap: Record<string, string> = {
      "lab-grown-plants": "Lab Grown Plants",
      "seeds": "Seeds",
      "fertilizers": "Fertilizers",
      "pesticides": "Pesticides",
      "farming-tools": "Farming Tools",
      "irrigation": "Irrigation"
    };
    return categoryMap[catId] || "Products";
  };

  // Get products for current category
  const products = categoryId && productsByCategory[categoryId] ? productsByCategory[categoryId] : [];

  // Filter and sort controls
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' }
  ];

  if (!categoryId || !productsByCategory[categoryId]) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Button variant="ghost" onClick={() => navigate('/market')} className="mr-2">
                <ArrowLeft className="mr-2" /> Back to Market
              </Button>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <h2 className="text-xl font-semibold mb-2">Category not found</h2>
                  <p className="text-gray-500 mb-6">The category you're looking for doesn't exist.</p>
                  <Button onClick={() => navigate('/market')}>Return to Market</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/market')} 
                className="mr-2 group text-gray-600 hover:text-foliage mb-2 md:mb-0 pl-0"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" /> 
                Back to Market
              </Button>
              <h1 className="text-3xl font-bold flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark to-sky-dark">
                  {getCategoryName(categoryId)}
                </span>
                <Badge className="ml-3 bg-foliage text-white border-0">
                  {products.length} products
                </Badge>
              </h1>
            </div>

            <div className="flex items-center space-x-2 bg-white shadow-sm rounded-lg p-1">
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-md ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-md ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-gray-200"></div>
              <select
                className="bg-transparent border-0 text-sm focus:outline-none focus:ring-0 text-gray-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="ml-1">Filters</span>
              </Button>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="h-[350px] animate-pulse border-0">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="space-y-2 pt-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <motion.div 
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, staggerChildren: 0.05 }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {viewMode === 'grid' ? (
                        <ProductCard product={product} categoryId={categoryId} />
                      ) : (
                        <Link to={`/market/${categoryId}/${product.id}`}>
                          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                                {product.discount && (
                                  <Badge className="absolute top-2 right-2 bg-red-500 border-0 z-10">
                                    -{product.discount}%
                                  </Badge>
                                )}
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div className="md:w-2/3 p-4">
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={`${
                                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                                </div>
                                <p className="text-gray-600 my-2">{product.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                  <div>
                                    <span className="text-foliage-dark font-bold text-xl">₹{product.price}</span>
                                    {product.discount && (
                                      <span className="text-gray-500 line-through ml-2">
                                        ₹{Math.round(product.price * (1 + product.discount / 100))}
                                      </span>
                                    )}
                                  </div>
                                  <Button variant="outline" className="group hover:bg-foliage hover:text-white border-foliage text-foliage">
                                    <span>View Details</span>
                                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-16 bg-white rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-2">No products found</h2>
                  <p className="text-gray-500 mb-6">There are no products in this category yet.</p>
                  <Button onClick={() => navigate('/market')}>Return to Market</Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
