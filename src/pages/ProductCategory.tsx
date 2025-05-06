
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Star, ChevronRight } from "lucide-react";
import { productsByCategory } from "@/data/marketData";

export default function ProductCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
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
            <Card>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/market')} 
                className="mr-2 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="mr-2" /> Back to Market
              </Button>
            </div>
            <h1 className="text-2xl font-bold">{getCategoryName(categoryId)}</h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="h-[350px] animate-pulse">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Link key={product.id} to={`/market/${categoryId}/${product.id}`}>
                      <Card className="h-full overflow-hidden border-2 border-transparent hover:border-foliage transition-all duration-300 hover:shadow-lg">
                        <div className="h-48 overflow-hidden relative">
                          {product.discount && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-full z-10">
                              -{product.discount}%
                            </div>
                          )}
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110" 
                          />
                        </div>
                        <CardContent className="py-4">
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
                          <div className="mt-2">
                            <span className="text-foliage-dark font-bold text-lg">${product.price}</span>
                            {product.discount && (
                              <span className="text-gray-500 line-through ml-2">
                                ${Math.round(product.price * (1 + product.discount / 100))}
                              </span>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full hover:bg-foliage hover:text-white">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h2 className="text-xl font-semibold mb-2">No products found</h2>
                  <p className="text-gray-500 mb-6">There are no products in this category yet.</p>
                  <Button onClick={() => navigate('/market')}>Return to Market</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
