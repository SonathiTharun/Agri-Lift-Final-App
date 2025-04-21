import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/components/LanguageContext';
import { 
  Sprout, 
  Tractor, 
  ShieldCheck, 
  Leaf, 
  Globe, 
  ArrowRight 
} from 'lucide-react';

const Welcome = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Services Button - Top Left */}
        <div className="absolute top-4 left-4">
          <Link to="/services">
            <Button variant="outline" className="text-emerald-700 hover:bg-emerald-50">
              Services
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-800 mb-6">
            {t("welcomeTitle")}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {t("welcomeSubtitle")}
          </p>
          <div className="space-x-4">
            <Link to="/services">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                {t("exploreServices")} <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                {t("contactUs")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-emerald-600 mb-4">
              <Sprout className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("feature1Title")}</h3>
            <p className="text-gray-600">{t("feature1Description")}</p>
          </div>

          <div className="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-emerald-600 mb-4">
              <Tractor className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("feature2Title")}</h3>
            <p className="text-gray-600">{t("feature2Description")}</p>
          </div>

          <div className="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-emerald-600 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("feature3Title")}</h3>
            <p className="text-gray-600">{t("feature3Description")}</p>
          </div>

          <div className="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-emerald-600 mb-4">
              <Leaf className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("feature4Title")}</h3>
            <p className="text-gray-600">{t("feature4Description")}</p>
          </div>

          <div className="feature-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-emerald-600 mb-4">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("feature5Title")}</h3>
            <p className="text-gray-600">{t("feature5Description")}</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-4">{t("readyToStart")}</h2>
          <p className="text-gray-600 mb-8">{t("startToday")}</p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              {t("getStarted")}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;
