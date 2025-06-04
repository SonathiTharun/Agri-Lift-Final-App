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

const translations = {
  en: {
    "hero-title": "Empowering Farmers, Transforming Agriculture",
    "hero-description": "Comprehensive platform offering end-to-end agricultural solutions, from land testing to market selling",
    "farmer-login": "Farmer Login",
    "farmer-register": "Register as Farmer",
    "executive-portal": "Executive Portal",
    "solutions-title": "Our Comprehensive Solutions",
    "solutions-description": "Innovative agricultural technologies designed to increase efficiency and sustainability",
    "land-testing": "Land Testing",
    "land-testing-desc": "Advanced AI-driven soil analysis and crop recommendations",
    "loan-services": "Loan Services",
    "loan-services-desc": "Simplified access to government and private agricultural loans",
    "market": "Market",
    "market-desc": "Quality seeds and products sourced from trusted suppliers",
    "machinery-options": "Machinery Options",
    "machinery-options-desc": "Flexible ploughing and harvesting machinery rental",
    "labor-management": "Labor Management",
    "labor-management-desc": "Connect with skilled planting workers and farm managers",
    "weather-forecasts": "Weather Forecasts",
    "weather-forecasts-desc": "Localized, real-time weather updates for precise planning",
    "diverse-farming": "Diverse Farming",
    "diverse-farming-desc": "Support for poultry, dairy, and fishing farm operations",
    "market-connections": "Export",
    "market-connections-desc": "Direct crop selling platform to maximize farmer profits",
    "footer-title": "AgriLift - Your Agricultural Partner",
    "footer-description": "Innovating agriculture through technology and sustainable solutions",
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
    "support": "Support",
    "copyright": "© 2025 AgriLift. All Rights Reserved.",
    "language": "Language"
  },
  hi: {
    "hero-title": "किसानों को सशक्त बनाना, कृषि को बदलना",
    "hero-description": "जमीन परीक्षण से लेकर बाजार बिक्री तक संपूर्ण कृषि समाधान प्रदान करने वाला व्यापक मंच",
    "farmer-login": "किसान लॉगिन",
    "farmer-register": "किसान के रूप में पंजीकरण करें",
    "executive-portal": "कार्यकारी पोर्टल",
    "solutions-title": "हमारे व्यापक समाधान",
    "solutions-description": "दक्षता और स्थिरता बढ़ाने के लिए नवीन कृषि प्रौद्योगिकियाँ",
    "land-testing": "भूमि परीक्षण",
    "land-testing-desc": "उन्नत AI-चालित मिट्टी विश्लेषण और फसल सिफारिशें",
    "loan-services": "ऋण सेवाएँ",
    "loan-services-desc": "सरकारी और निजी कृषि ऋणों तक सरल पहुँच",
    "market": "बाज़ा���",
    "market-desc": "विश्वसनीय आपूर्तिकर्ताओं से गुणवत्तापूर्ण बीज और उत्पाद",
    "machinery-options": "मशीनरी विकल्प",
    "machinery-options-desc": "लचीली जुताई और कटाई मशीनरी किराये पर",
    "labor-management": "श्रम प्रबंधन",
    "labor-management-desc": "कुशल रोपण श्रमिकों और खेत प्रबंधकों से जुड़ें",
    "weather-forecasts": "मौसम की भविष्यवाणी",
    "weather-forecasts-desc": "सटीक योजना के लिए स्थानीय, वास्तविक समय के मौसम अपडेट",
    "diverse-farming": "विविध खेती",
    "diverse-farming-desc": "पोल्ट्री, डेयरी और मत्स्य पालन के लिए समर्थन",
    "market-connections": "निर्यात",
    "market-connections-desc": "किसान लाभ को अधिकतम करने के लिए प्रत्यक्ष फसल बिक्री मंच",
    "footer-title": "एग्रीलिफ्ट - आपका कृषि साथी",
    "footer-description": "Innovating agriculture through technology and sustainable solutions",
    "privacy-policy": "गोपनीयता नीति",
    "terms-of-service": "सेवा की शर्तें",
    "support": "सहायता",
    "copyright": "© 2025 एग्रीलिफ्ट। सर्वाधिकार सुरक्षित।",
    "language": "भाषा"
  },
  ta: {
    "hero-title": "விவசாயிகளை மேம்படுத்துதல், விவசாயத்தை மாற்றுதல்",
    "hero-description": "நிலச் சோதனை முதல் சந்தை விற்பனை வரை முழுமையான விவசாய தீர்வுகளை வழங்கும் விரிவான தளம்",
    "farmer-login": "விவசாயி உள்நுழைவு",
    "farmer-register": "விவசாயியாக பதிவு செய்யுங்கள்",
    "executive-portal": "நிர்வாக போர்டல்",
    "solutions-title": "எங்களின் விரிவான தீர்வுகள்",
    "solutions-description": "திறன் மற்றும் நிலைத்தன்மையை அதிகரிக்க புதுமையான விவசாய தொழில்நுட்பங்கள்",
    "land-testing": "நிலச் சோதனை",
    "land-testing-desc": "மேம்பட்ட AI-இயக்கப்படும் மண் பகுப்பாய்வு மற்றும் பயிர் பரிந்துரைகள்",
    "loan-services": "கடன் சேவைகள்",
    "loan-services-desc": "அரசு மற்றும் தனியார் விவசாய கடன்களுக்கான எளிமையான அணுகல்",
    "market": "சந்தை",
    "market-desc": "விவசாயார் நம்பகமான விநியோகஸ்தர்களிடமிருந்து தரமான விதைகள் மற்றும் உत్పత్తుల்",
    "machinery-options": "இயந்திர விருப்பங்கள்",
    "machinery-options-desc": "நெகிழ்வான உழவு மற்றும் அறுவடை இயந்திர வாடகை",
    "labor-management": "தொழிலாளர் மேலாண்மை",
    "labor-management-desc": "திறமையான நடவு தொழிலாளர்கள் மற்றும் பண்ணை மேலாளர்களுடன் இணைக்கவும்",
    "weather-forecasts": "வானிலை முன்னறிவிப்புகள்",
    "weather-forecasts-desc": "ఖచ్చితమైన ప్రణాళిక కోసం స్థానిక, రియల్-టైమ్ వாతావరణ నవీకరణలు",
    "diverse-farming": "விவேறு விவசாயம்",
    "diverse-farming-desc": "கோழி வளர்ப்பு, பால் பண்ணை மற்றும் மீன் வளர்ப்பு செயல்பாடுகளுக்கு ஆதரவு",
    "market-connections": "ஏற்றுமதி",
    "market-connections-desc": "விவசாயி லாபத்தை அதிகரிக்க நேரடி பயிர் விற்பனை தளம்",
    "footer-title": "அக்ரிலிஃப்ட் - உங்கள் விவசாய பங்காளர்",
    "footer-description": "సాంకేతిక పరిజ్ఞానం మరియు స్థిరమైన పరిష్కారాల ద్వారా వ్యవసాయంలో వినూత్నత",
    "privacy-policy": "తனியுரிமை கொள்கை",
    "terms-of-service": "சேவை விதிமுறைகளు",
    "support": "ஆதரவு",
    "copyright": "© 2025 அக்ரிலிஃப்ட். அனைத்து உரிமைகளుம் பாதுகாக்கப்பட்டவை.",
    "language": "மொழி"
  },
  te: {
    "hero-title": "రైతులను బలోపేతం చేయడం, వ్యవసాయాన్ని మార్చడం",
    "hero-description": "భూమి పరీక్ష నుండి మార్కెట్ విక్రయాల వరకు అంతిమదిశకు వ్యవసాయ పరిష్కారాలను అందించే సమగ్ర వేదిక",
    "farmer-login": "రైతు లాగిన్",
    "farmer-register": "రైతుగా నమోదు చేసుకోండి",
    "executive-portal": "ఎగ్జిక్యూటివ్ పోర్టల్",
    "solutions-title": "మా సమగ్ర పరిష్కారాలు",
    "solutions-description": "సామర్థ్యం మరియు స్థిరత్వాన్ని పెంచడానికి వినూత్న వ్యవసాయ సాంకేతికతలు",
    "land-testing": "భూమి పరీక్ష",
    "land-testing-desc": "అధునాతన AI-ఆధారిత మట్టి విశ్లేషణ మరియు పంట సిఫార్సులు",
    "loan-services": "రుణ సేవలు",
    "loan-services-desc": "ప్రభుత్వ మరియు ప్రైవేట్ వ్యవసాయ రుణాలకు సరళీకృత ప్రాప్తి",
    "market": "మార్కెట్",
    "market-desc": "నమ్మదగిన సరఫరాదారుల నుండి నాణ్యమైన విత్తనాలు మరియు ఉత్పత్తులు",
    "machinery-options": "యంత్రాల ఎంపికలు",
    "machinery-options-desc": "సౌకర్యవంతమైన దున్నడం మరియు పంట కోయడం యంత్రాల అద్దె",
    "labor-management": "కార్మిక నిర్వహణ",
    "labor-management-desc": "నైపుణ్యం గల నాటు కార్మికులు మరియు వ్యవసాయ నిర్వాహకులతో కనెక్ట్ అవ్వ��డి",
    "weather-forecasts": "వాతావరణ సూచనలు",
    "weather-forecasts-desc": "ఖచ్చితమైన ప్రణాళిక కోసం స్థానిక, రియల్-టైమ్ వాతావరణ నవీకరణలు",
    "diverse-farming": "వైవిధ్యమైన వ్యవసాయం",
    "diverse-farming-desc": "పౌల్ట్రీ, డైరీ మరియు మత్స్య సాగు కార్�కలాపాలకు మద్దతు",
    "market-connections": "ఎగుమతి",
    "market-connections-desc": "రైతు లాభాలను గరిష్టీకరించడానికి ప్రత్యక్ష పంట అమ్మకాల వేదిక",
    "footer-title": "అగ్రిలిఫ్ట్ - ఉங்களు వ్యవసాయ భాగస్వామి",
    "footer-description": "సాంకేతిక పరిజ్ఞానం మరియు స్థిరమైన పరిష్కారాల ద్వారా వ్యవసాయంలో వినూత్నత",
    "privacy-policy": "గోప్యతా విధానం",
    "terms-of-service": "సేవా నిబంధనలు",
    "support": "మద్దతు",
    "copyright": "© 2025 అగ్రిలిఫ్ట్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.",
    "language": "భాష"
  }
};

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
  const [lang, setLang] = useState('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [userType, setUserType] = useState<'farmer' | 'executive'>('farmer');
  
  const t = (key: string) => translations[lang]?.[key] || translations.en[key];

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
    // Additional success handling can be added here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="fixed top-24 sm:top-20 right-4 z-40 transform scale-[0.6] origin-top-right">
        <WeatherWidget />
      </div>
      
      <div className="fixed top-20 left-4 z-40 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
        <select 
          value={lang}
          onChange={(e) => setLang(e.target.value)}
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
                  Register as Executive
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
      
      <footer className="bg-gradient-to-r from-foliage-dark to-foliage text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('footer-title')}</h3>
              <p className="text-white/80 mb-6">{t('footer-description')}</p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Facebook</span>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Twitter</span>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <span className="sr-only">Instagram</span>
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
                <Link to="/loans" className="text-white/80 hover:text-white transition-colors">Loans</Link>
                <Link to="/market" className="text-white/80 hover:text-white transition-colors">Market</Link>
                <Link to="/labour" className="text-white/80 hover:text-white transition-colors">Labour</Link>
                <Link to="/machinery" className="text-white/80 hover:text-white transition-colors">Machinery</Link>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/80 hover:text-white transition-colors">{t('privacy-policy')}</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">{t('terms-of-service')}</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">{t('support')}</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-10 pt-6 text-center">
            <p className="text-white/70">{t('copyright')}</p>
          </div>
        </div>
      </footer>
      
      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onSuccess={handleLoginSuccess}
      />
      
      <RegisterModal
        open={registerOpen}
        setOpen={setRegisterOpen}
        userType={userType}
        lang={lang}
        t={t}
      />
    </div>
  );
};

export default Welcome;
