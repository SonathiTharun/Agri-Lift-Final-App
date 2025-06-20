
import { WeatherWidget } from "@/components/WeatherWidget";
import { SoilAnalysis } from "@/components/SoilAnalysis";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShoppingCart, Package } from "lucide-react";
import { withAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useCart } from "@/hooks/useCart";
import { apiService } from "@/services/apiService";

const Dashboard = () => {
  const { t } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);

  // Real-time data hooks
  const { weatherData, marketData, isLoading: isRealTimeLoading } = useRealTimeData();
  const { cart, isLoading: isCartLoading } = useCart();

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load featured products
        const productsResponse = await apiService.getFeaturedProducts(4);
        if (productsResponse.success) {
          setFeaturedProducts(productsResponse.data.products);
        }

        // Load market prices
        const pricesResponse = await apiService.getRealTimePrices(['wheat', 'rice', 'tomato'], 3);
        if (pricesResponse.success) {
          setMarketPrices(pricesResponse.data.ticker);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  return (
    <Layout>
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">{t('dashboard-title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('dashboard-welcome')}
          </p>
        </div>
        
        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('cart-summary')}</h3>
              <ShoppingCart className="h-6 w-6 text-foliage" />
            </div>
            {isCartLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-foliage">{cart?.totalItems || 0}</p>
                <p className="text-sm text-gray-600">{t('items-in-cart')}</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">₹{cart?.subtotal?.toFixed(2) || '0.00'}</p>
              </div>
            )}
          </div>

          {/* Market Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('market-trends')}</h3>
              <TrendingUp className="h-6 w-6 text-foliage" />
            </div>
            {isRealTimeLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {marketPrices.slice(0, 2).map((price, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{price.name}</span>
                    <span className={`text-sm font-semibold ${price.trend === 'up' ? 'text-green-600' : price.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      ₹{price.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('featured-products')}</h3>
              <Package className="h-6 w-6 text-foliage" />
            </div>
            <div className="space-y-2">
              {featuredProducts.slice(0, 2).map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate">{product.name}</span>
                  <span className="text-sm font-semibold text-foliage">₹{product.price}</span>
                </div>
              ))}
              <Link to="/market" className="text-sm text-foliage hover:text-foliage-dark">
                {t('view-all')} →
              </Link>
            </div>
          </div>
        </div>

        {/* Crop Allocation Card */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold text-foliage-dark mb-4">{t('crop-allocation-title')}</h2>
          <p className="text-gray-600 mb-6">
            {t('crop-allocation-description')}
          </p>
          <Link to="/crop-allocation" className="inline-flex items-center">
            <Button className="bg-foliage hover:bg-foliage-dark">
              {t('plan-crops')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Main Content Container */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <SoilAnalysis />
        </div>
        
        {/* Footer Information */}
        <div className="mt-16 text-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>{t('footer-text')}</p>
        </div>
      </main>
    </Layout>
  );
};

export default withAuth(Dashboard, 'farmer');
