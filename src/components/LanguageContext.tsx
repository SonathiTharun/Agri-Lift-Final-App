
import React, { createContext, useContext, useState, ReactNode } from 'react';

export const translations = {
  en: {
    "home": "Home",
    "loans": "Loans",
    "contact": "Contact",
    "market": "Market",
    "labour": "Labour",
    "machinery": "Machinery",
    "export": "Export",
    "monitoring": "Monitoring",
    "services": "Services",
    "service-title": "Our Services",
    "service-description": "Comprehensive agricultural solutions for modern farming",
    "loans-title": "Smart Agri Loans Guide",
    "loans-description": "Discover official bank rates, compare loan options, and get guidance on government and private agricultural loans suited for your needs.",
    "market-title": "AgriLift Market",
    "market-description": "Explore our range of high-quality agricultural products to boost your farm's productivity",
    "labour-title": "Labour Solutions",
    "labour-description": "Find skilled agricultural workers for your farm operations",
    "machinery-title": "Farm Machinery",
    "machinery-description": "Access modern farming equipment through flexible rental or purchase options.",
    "export-title": "Export Services",
    "export-description": "Expand your market reach with our comprehensive export solutions",
    "monitoring-title": "Farm Monitoring",
    "monitoring-description": "Advanced monitoring solutions for optimal farm management",
    "contact-title": "Contact Us",
    "contact-description": "Get in touch with our team for any inquiries or assistance"
  },
  hi: {
    "home": "होम",
    "loans": "ऋण",
    "contact": "संपर्क",
    "market": "बाज़ार",
    "labour": "श्रम",
    "machinery": "मशीनरी",
    "export": "निर्यात",
    "monitoring": "निगरानी",
    "services": "सेवाएं",
    "service-title": "हमारी सेवाएं",
    "service-description": "आधुनिक खेती के लिए व्यापक कृषि समाधान",
    "loans-title": "स्मार्ट कृषि ऋण गाइड",
    "loans-description": "आधिकारिक बैंक दरों की खोज करें, ऋण विकल्पों की तुलना करें, और अपनी जरूरतों के अनुरूप सरकारी और निजी कृषि ऋणों पर मार्गदर्शन प्राप्त करें।",
    "market-title": "अग्रिलिफ्ट मार्केट",
    "market-description": "अपने खेत की उत्पादकता बढ़ाने के लिए उच्च गुणवत्ता वाले कृषि उत्पादों की खोज करें",
    "labour-title": "श्रम समाधान",
    "labour-description": "अपने खेत के संचालन के लिए कुशल कृषि श्रमिक खोजें",
    "machinery-title": "खेती की मशीनरी",
    "machinery-description": "लचीले किराये या खरीद विकल्पों के माध्यम से आधुनिक खेती उपकरणों तक पहुंचें।",
    "export-title": "निर्यात सेवाएं",
    "export-description": "हमारे व्यापक निर्यात समाधानों के साथ अपने बाजार पहुंच का विस्तार करें",
    "monitoring-title": "खेत निगरानी",
    "monitoring-description": "इष्टतम खेत प्रबंधन के लिए उन्नत निगरानी समाधान",
    "contact-title": "हमसे संपर्क करें",
    "contact-description": "किसी भी प्रश्न या सहायता के लिए हमारी टीम से संपर्क करें"
  },
  ta: {
    "home": "முகப்பு",
    "loans": "கடன்கள்",
    "contact": "தொடர்பு",
    "market": "சந்தை",
    "labour": "தொழிலாளர்",
    "machinery": "இயந்திரங்கள்",
    "export": "ஏற்றுமதி",
    "monitoring": "கண்காணிப்பு",
    "services": "சேவைகள்",
    "service-title": "எங்கள் சேவைகள்",
    "service-description": "நவீன விவசாயத்திற்கான விரிவான விவசாய தீர்வுகள்",
    "loans-title": "ஸ்மார்ட் விவசாய கடன் வழிகாட்டி",
    "loans-description": "அதிகாரப்பூர்வ வங்கி விகிதங்களைக் கண்டறியுங்கள், கடன் விருப்பங்களை ஒப்பிடுங்கள், மற்றும் உங்கள் தேவைகளுக்கு ஏற்ற அரசு மற்றும் தனியார் விவசாய கடன்கள் குறித்த வழிகாட்டுதல்களைப் பெறுங்கள்.",
    "market-title": "அக்ரிலிஃப்ட் சந்தை",
    "market-description": "உங்கள் விவசாயத்தின் உற்பத்தித்திறனை அதிகரிக்க உயர்தர விவசாய தயாரிப்புகளை ஆராயுங்கள்",
    "labour-title": "தொழிலாளர் தீர்வுகள்",
    "labour-description": "உங்கள் விவசாய செயல்பாடுகளுக்கு திறமையான விவசாய தொழிலாளர்களைக் கண்டறியுங்கள்",
    "machinery-title": "விவசாய இயந்திரங்கள்",
    "machinery-description": "நெகிழ்வான வாடகை அல்லது கொள்முதல் விருப்பங்கள் மூலம் நவீன விவசாய உபகரணங்களை அணுகவும்.",
    "export-title": "ஏற்றுமதி சேவைகள்",
    "export-description": "எங்களின் விரிவான ஏற்றுமதி தீர்வுகளுடன் உங்கள் சந்தை எட்டுப்பரப்பை விரிவுபடுத்துங்கள்",
    "monitoring-title": "விவசாய கண்காணிப்பு",
    "monitoring-description": "சிறந்த விவசாய நிர்வாகத்திற்கான மேம்பட்ட கண்காணிப்பு தீர்வுகள்",
    "contact-title": "எங்களை தொடர்பு கொள்ளுங்கள்",
    "contact-description": "எந்தவொரு கேள்விகள் அல்லது உதவிக்கும் எங்கள் குழுவை தொடர்பு கொள்ளுங்கள்"
  },
  te: {
    "home": "హోమ్",
    "loans": "రుణాలు",
    "contact": "సంప్రదించండి",
    "market": "మార్కెట్",
    "labour": "కార్మికులు",
    "machinery": "యంత్రాలు",
    "export": "ఎగుమతి",
    "monitoring": "పర్యవేక్షణ",
    "services": "సేవలు",
    "service-title": "మా సేవలు",
    "service-description": "ఆధునిక వ్యవసాయానికి సమగ్ర వ్యవసాయ పరిష్కారాలు",
    "loans-title": "స్మార్ట్ వ్యవసాయ రుణాల మార్గదర్శి",
    "loans-description": "అధికారిక బ్యాంకు రేట్లను కనుగొనండి, రుణ ఎంపికలను పోల్చండి మరియు మీ అవసరాలకు తగిన ప్రభుత్వ మరియు ప్రైవేట్ వ్యవసాయ రుణాలపై మార్గదర్శకత్వాన్ని పొందండి.",
    "market-title": "అగ్రిలిఫ్ట్ మార్కెట్",
    "market-description": "మీ వ్యవసాయ ఉత్పాదకతను పెంచడానికి నాణ్యమైన వ్యవసాయ ఉత్పత్తులను అన్వేషించండి",
    "labour-title": "కార్మిక పరిష్కారాలు",
    "labour-description": "మీ వ్యవసాయ కార్యకలాపాల కోసం నైపుణ్యం కలిగిన వ్యవసాయ కార్మికులను కనుగొనండి",
    "machinery-title": "వ్యవసాయ యంత్రాలు",
    "machinery-description": "సౌకర్యవంతమైన అద్దె లేదా కొనుగోలు ఎంపికల ద్వారా ఆధునిక వ్యవసాయ పరికరాలను పొందండి.",
    "export-title": "ఎగుమతి సేవలు",
    "export-description": "మా సమగ్ర ఎగుమతి పరిష్కారాలతో మీ మార్కెట్ రేంజ్‌ని విస్తరించండి",
    "monitoring-title": "వ్యవసాయ పర్యవేక్షణ",
    "monitoring-description": "అనుకూల వ్యవసాయ నిర్వహణ కోసం అధునాతన పర్యవేక్షణ పరిష్కారాలు",
    "contact-title": "మమ్మల్ని సంప్రదించండి",
    "contact-description": "ఏవైనా ప్రశ్నలు లేదా సహాయం కోసం మా బృందాన్ని సంప్రదించండి"
  }
};

type Language = 'en' | 'hi' | 'ta' | 'te';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
