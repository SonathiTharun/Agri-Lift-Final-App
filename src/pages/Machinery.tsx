
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Machinery = () => {
  const { t } = useLanguage();

  const machinery = [
    {
      title: "Tractors",
      description: "Modern tractors for efficient field operations",
      features: ["GPS navigation", "Climate control", "Fuel efficient"],
    },
    {
      title: "Harvesters",
      description: "Advanced harvesting equipment for various crops",
      features: ["Automatic height control", "Crop monitoring", "Minimal wastage"],
    },
    {
      title: "Irrigation Systems",
      description: "Smart irrigation solutions for optimal water usage",
      features: ["Weather monitoring", "Automated scheduling", "Remote control"],
    },
    {
      title: "Drones",
      description: "Agricultural drones for field monitoring and spraying",
      features: ["HD cameras", "Precise spraying", "Coverage mapping"],
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      <main className="container mx-auto pt-28 px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">{t("machinery-title")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("machinery-description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {machinery.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <ul className="space-y-2 mb-6">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="mr-2 text-emerald-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full">Learn More</Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Machinery;
