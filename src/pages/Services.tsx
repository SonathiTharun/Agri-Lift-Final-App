
import { useLanguage } from "@/components/LanguageContext";
import { Layout } from "@/components/Layout";

const Services = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">{t("service-title")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("service-description")}
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Services;
