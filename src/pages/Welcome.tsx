import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  ArrowRight, 
  UserCircle, 
  Beaker, 
  Banknote, 
  ShoppingBag, 
  Tractor, 
  Users, 
  CloudSun, 
  Egg, 
  Store 
} from 'lucide-react';
import { LoginModal } from '@/components/LoginModal';
import { RegisterModal } from '@/components/RegisterModal';
import { useLanguage } from '@/components/LanguageContext';

const backgroundImages = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
];

const features = [
  { icon: Beaker, key: "land-testing", descKey: "land-testing-desc", path: "/dashboard" },
  { icon: Banknote, key: "loan-services", descKey: "loan-services-desc", path: "/loans" },
  { icon: ShoppingBag, key: "market", descKey: "market-desc", path: "/market" },
  { icon: Tractor, key: "machinery-options", descKey: "machinery-options-desc", path: "/machinery" },
  { icon: Users, key: "labor-management", descKey: "labor-management-desc", path: "/labour" },
  { icon: CloudSun, key: "weather-forecasts", descKey: "weather-forecasts-desc", path: "/dashboard" },
  { icon: Egg, key: "diverse-farming", descKey: "diverse-farming-desc", path: "/farming-type" },
  { icon: Store, key: "market-connections", descKey: "market-connections-desc", path: "/export" },
];

const Welcome = () => {
  const { t, language, setLanguage } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [userType, setUserType] = useState<'farmer' | 'executive'>('farmer');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOpenLogin = (type: 'farmer' | 'executive') => {
    setUserType(type);
    setLoginOpen(true);
  };
  
  const handleOpenRegister = (type: 'farmer' | 'executive') => {
    setUserType(type);
    setRegisterOpen(true);
  };

  const handleLoginSuccess = () => {
    console.log('Login successful');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="fixed top-24 sm:top-20 right-4 z-40 transform scale-[0.6] origin-top-right">
        <WeatherWidget />
      </div>
      
      <div className="fixed top-20 left-4 z-40 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-sm font-medium focus:outline-none"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>
      
      <section className="relative h-screen flex items-center">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-black/60 backdrop-blur-sm p-8 md:p-12 rounded-xl max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('hero-title')}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-10">{t('hero-description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="space-y-2">
                <Button 
                  onClick={() => handleOpenLogin('farmer')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <UserCircle size={18} /> {t('farmer-login')}
                </Button>
                <Button 
                  onClick={() => handleOpenRegister('farmer')}
                  variant="outline" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  {t('farmer-register')}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => handleOpenLogin('executive')}
                  className="w-full bg-foliage hover:bg-foliage-dark text-white flex items-center gap-2"
                >
                  <Briefcase size={18} /> {t('executive-portal')}
                </Button>
                <Button 
                  onClick={() => handleOpenRegister('executive')}
                  variant="outline" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  {t('farmer-register')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              {t('solutions-title')}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-foliage rounded-full" />
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('solutions-description')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden group"
              >
                <Link to={feature.path}>
                  <CardContent className="p-6">
                    <div className="mb-4 text-foliage bg-foliage/10 w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-foliage transition-colors">
                      {t(feature.key)}
                    </h3>
                    <p className="text-gray-600 text-sm">{t(feature.descKey)}</p>
                    <div className="flex items-center gap-1 mt-4 text-foliage text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ArrowRight size={14} />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onSuccess={handleLoginSuccess}
      />
      
      <RegisterModal
        open={registerOpen}
        setOpen={setRegisterOpen}
        userType={userType}
        lang={language}
        t={t}
      />
    </div>
  );
};

export default Welcome;
