
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Labour Management</h3>
            <p className="text-gray-600 mb-4">Efficiently manage your workforce with our comprehensive labour management system.</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Track attendance and performance
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Automated payroll processing
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Skill-based worker allocation
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Worker Training</h3>
            <p className="text-gray-600 mb-4">Comprehensive training programs to enhance worker skills and productivity.</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Safety protocol training
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Equipment operation courses
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Best practices workshops
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Workforce Analytics</h3>
            <p className="text-gray-600 mb-4">Data-driven insights to optimize your workforce management.</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Productivity metrics
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Cost analysis
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Performance reports
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Labour;
