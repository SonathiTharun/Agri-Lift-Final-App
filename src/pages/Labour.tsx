
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";

const Labour = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      <main className="container mx-auto pt-28 px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">{t("labour-title")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("labour-description")}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Labour;
