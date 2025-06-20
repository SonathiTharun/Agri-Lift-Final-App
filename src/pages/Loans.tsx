import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "@/components/market/GlassCard";
import { ModernBankCard } from "@/components/loans/ModernBankCard";
import { EnhancedLoanCalculator } from "@/components/loans/EnhancedLoanCalculator";
import { LoanComparison } from "@/components/loans/LoanComparison";
import { LoanApplicationWizard } from "@/components/loans/LoanApplicationWizard";
import { LoanFAQ } from "@/components/loans/LoanFAQ";
import { FloatingActionButton } from "@/components/loans/FloatingActionButton";
import { EligibilityChecker } from "@/components/loans/EligibilityChecker";
import {
  Calculator,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Star,
  ChevronRight,
  Banknote,
  PieChart,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Zap,
  HelpCircle,
  UserCheck
} from "lucide-react";

type Bank = {
  name: string;
  logo: string;
  alt: string;
  website: string;
  features: string[];
  rate: string;
  type: "Government" | "Private";
  country: string;
  rating: number;
  processingTime: string;
  minAmount: number;
  maxAmount: number;
  eligibility: string[];
  documents: string[];
};

type LoanCategory = {
  id: string;
  name: string;
  nameKey: string;
  icon: React.ReactNode;
  description: string;
  descriptionKey: string;
  minRate: number;
  maxRate: number;
  features: string[];
  featuresKeys: string[];
};

type SuccessStory = {
  id: string;
  name: string;
  location: string;
  loanAmount: number;
  purpose: string;
  story: string;
  image: string;
  rating: number;
};

const loanCategories: LoanCategory[] = [
  {
    id: "crop-loan",
    name: "Crop Loans",
    nameKey: "crop-loans",
    icon: <Sparkles className="h-6 w-6" />,
    description: "Short-term loans for crop cultivation and seasonal farming needs",
    descriptionKey: "crop-loans-desc",
    minRate: 7.0,
    maxRate: 12.0,
    features: ["Seasonal financing", "Quick approval", "Flexible repayment"],
    featuresKeys: ["seasonal-financing", "quick-approval", "flexible-repayment"]
  },
  {
    id: "equipment-loan",
    name: "Equipment Loans",
    nameKey: "equipment-loans",
    icon: <Target className="h-6 w-6" />,
    description: "Long-term financing for agricultural machinery and equipment",
    descriptionKey: "equipment-loans-desc",
    minRate: 8.5,
    maxRate: 14.0,
    features: ["Up to 7 years tenure", "Machinery financing", "Subsidies available"],
    featuresKeys: ["up-to-years-tenure", "machinery-financing", "subsidies-available"]
  },
  {
    id: "land-loan",
    name: "Land Purchase",
    nameKey: "land-purchase",
    icon: <Award className="h-6 w-6" />,
    description: "Loans for purchasing agricultural land and property",
    descriptionKey: "land-purchase-desc",
    minRate: 9.0,
    maxRate: 15.0,
    features: ["Long tenure", "Competitive rates", "Property insurance"],
    featuresKeys: ["long-tenure", "competitive-rates", "property-insurance"]
  },
  {
    id: "working-capital",
    name: "Working Capital",
    nameKey: "working-capital",
    icon: <Zap className="h-6 w-6" />,
    description: "Short-term loans for day-to-day farming operations",
    descriptionKey: "working-capital-desc",
    minRate: 8.0,
    maxRate: 13.0,
    features: ["Quick disbursal", "Minimal documentation", "Revolving credit"],
    featuresKeys: ["quick-disbursal", "minimal-documentation", "revolving-credit"]
  }
];

const successStories: SuccessStory[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    location: "Punjab, India",
    loanAmount: 500000,
    purpose: "Tractor Purchase",
    story: "With AgriLift's help, I got a loan for a new tractor that increased my farm productivity by 40%.",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "2",
    name: "Maria Santos",
    location: "São Paulo, Brazil",
    loanAmount: 300000,
    purpose: "Crop Expansion",
    story: "The quick approval process helped me expand my soybean cultivation just in time for the season.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "3",
    name: "John Smith",
    location: "Iowa, USA",
    loanAmount: 750000,
    purpose: "Land Purchase",
    story: "Secured financing for additional farmland that doubled my corn production capacity.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4
  }
];

const banks: Bank[] = [
  {
    name: "State Bank of India",
    logo: "data:image/png;base64,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",
    alt: "State Bank of India logo",
    website: "https://sbi.co.in/web/agri-rural/agriculture-banking",
    features: [
      "Crop & equipment finance",
      "Flexible repayment",
      "Low interest rates",
    ],
    rate: "7.1% - 8.6%",
    type: "Government",
    country: "India",
    rating: 4.2,
    processingTime: "7-10 days",
    minAmount: 50000,
    maxAmount: 5000000,
    eligibility: ["Valid land documents", "Age 18-65", "Good credit score"],
    documents: ["Aadhaar", "PAN", "Land papers", "Income proof"]
  },
  {
    name: "Punjab National Bank",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmypyP9SZ5cpoElisTB0suA4SFhXvljp8grQ&s",
    alt: "Punjab National Bank logo",
    website: "https://www.pnbindia.in/Agriculture-Banking.html",
    features: [
      "Kisan credit card",
      "Agri infrastructure loan",
      "Subsidy options",
    ],
    rate: "7.4% - 9.2%",
    type: "Government",
    country: "India",
    rating: 4.0,
    processingTime: "10-15 days",
    minAmount: 25000,
    maxAmount: 3000000,
    eligibility: ["Land ownership", "Age 18-60", "Farming experience"],
    documents: ["Aadhaar", "PAN", "Land records", "Bank statements"]
  },
  {
    name: "HDFC Bank",
    logo: "data:image/png;base64,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",
    alt: "HDFC Bank logo",
    website: "https://www.hdfcbank.com/personal/products/loans/farmer-loan",
    features: [
      "Quick sanction",
      "Minimal paperwork",
      "Custom loan products",
    ],
    rate: "9.0% - 13.0%",
    type: "Private",
    country: "India",
    rating: 4.1,
    processingTime: "5-7 days",
    minAmount: 100000,
    maxAmount: 7500000,
    eligibility: ["Stable income", "Age 21-65", "Good credit history"],
    documents: ["Aadhaar", "PAN", "Salary slips", "Bank statements"]
  },
  {
    name: "Bank of Baroda",
    logo: "data:image/png;base64,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",
    alt: "Bank of Baroda logo",
    website: "https://www.bankofbaroda.in/agricultural-loans",
    features: [
      "Flexible repayment plans",
      "Agri gold loans",
      "Kisan credit card",
    ],
    rate: "7.3% - 9.0%",
    type: "Government",
    country: "India",
    rating: 3.9,
    processingTime: "12-18 days",
    minAmount: 50000,
    maxAmount: 5000000,
    eligibility: ["Land ownership", "Age 18-65", "Farming background"],
    documents: ["Aadhaar", "PAN", "Land documents", "Income proof"]
  },
  {
    name: "ICICI Bank",
    logo: "data:image/png;base64,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",
    alt: "ICICI Bank logo",
    website: "https://www.icicibank.com/Personal-Banking/loans/farmer-loan",
    features: [
      "Fast disbursal",
      "Digital application",
      "Agri business specialist",
    ],
    rate: "8.9% - 12.5%",
    type: "Private",
    country: "India",
    rating: 4.3,
    processingTime: "7-10 days",
    minAmount: 100000,
    maxAmount: 10000000,
    eligibility: ["Stable income", "Age 21-65", "Good credit score"],
    documents: ["Aadhaar", "PAN", "Income proof", "Bank statements"]
  },
  {
    name: "Bank of America",
    logo: "data:image/png;base64,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",
    alt: "Bank of America logo",
    website: "https://www.bankofamerica.com/smallbusiness/business-financing/sba-loans",
    features: [
      "Tailored agri loans",
      "SBA guarantee",
      "Flexible EMI",
    ],
    rate: "5.5% - 8.0%",
    type: "Private",
    country: "United States",
    rating: 4.1,
    processingTime: "14-21 days",
    minAmount: 150000,
    maxAmount: 15000000,
    eligibility: ["Business plan", "Age 21-70", "US citizenship/residency"],
    documents: ["SSN", "Tax returns", "Business license", "Financial statements"]
  },
  {
    name: "Wells Fargo",
    logo: "data:image/png;base64,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",
    alt: "Wells Fargo logo",
    website: "https://www.wellsfargo.com/biz/business-credit/agriculture",
    features: [
      "Farm operational lines",
      "Equipment finance",
      "Large agri business support",
    ],
    rate: "6.0% - 9.0%",
    type: "Private",
    country: "United States",
    rating: 4.0,
    processingTime: "10-14 days",
    minAmount: 100000,
    maxAmount: 12000000,
    eligibility: ["Business experience", "Age 21-65", "US citizenship/residency"],
    documents: ["SSN", "Tax returns", "Business plan", "Financial statements"]
  },
  {
    name: "Rabobank",
    logo: "data:image/jpeg;base64,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",
    alt: "Rabobank logo",
    website: "https://www.rabobank.com/about-us/food-and-agri.html",
    features: [
      "Global agri expertise",
      "Large project funding",
      "Innovation loans",
    ],
    rate: "6.8% - 10.2%",
    type: "Private",
    country: "Brazil",
    rating: 4.3,
    processingTime: "15-20 days",
    minAmount: 200000,
    maxAmount: 25000000,
    eligibility: ["Agricultural experience", "Age 21-65", "Brazilian residency"],
    documents: ["CPF", "Tax returns", "Property documents", "Business plan"]
  },
  {
    name: "Caixa Econômica Federal",
    logo: "data:image/png;base64,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",
    alt: "Caixa Econômica Federal logo",
    website: "https://www.caixa.gov.br/voce/credito/credito-rural/Paginas/default.aspx",
    features: [
      "Rural property loans",
      "Low interest rates",
      "Government schemes",
    ],
    rate: "4.5% - 7.0%",
    type: "Government",
    country: "Brazil",
    rating: 4.6,
    processingTime: "12-18 days",
    minAmount: 150000,
    maxAmount: 20000000,
    eligibility: ["Agricultural business", "Age 18-70", "Brazilian citizenship"],
    documents: ["CPF", "Income proof", "Property documents", "Business registration"]
  },
  {
    name: "Banco do Brasil",
    logo: "data:image/png;base64,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",
    alt: "Banco do Brasil logo",
    website: "https://www.bb.com.br/site/agro/",
    features: [
      "Various agri loan schemes",
      "Experienced rural lending",
      "Government support",
    ],
    rate: "5.2% - 8.3%",
    type: "Government",
    country: "Brazil",
    rating: 4.5,
    processingTime: "8-12 days",
    minAmount: 100000,
    maxAmount: 30000000,
    eligibility: ["Agricultural business", "Age 18-65", "Brazilian citizenship"],
    documents: ["CPF", "Tax returns", "Property documents", "Financial statements"]
  }
];

const countries = ["India", "United States", "Brazil"];
const defaultCountry = "India";

export default function Loans() {
  const [country, setCountry] = useState(defaultCountry);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("browse");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonBanks, setComparisonBanks] = useState<Bank[]>([]);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);
  const { t } = useLanguage();

  const banksForCountry = banks.filter((b) => b.country === country);

  const addToComparison = (bank: Bank) => {
    if (comparisonBanks.length < 3 && !comparisonBanks.find(b => b.name === bank.name)) {
      setComparisonBanks([...comparisonBanks, bank]);
    }
  };

  const removeFromComparison = (bankName: string) => {
    setComparisonBanks(comparisonBanks.filter(b => b.name !== bankName));
  };

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 12 / 100;
    const totalMonths = tenure * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
           (Math.pow(1 + monthlyRate, totalMonths) - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-foliage/10 to-blue-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foliage to-blue-600 bg-clip-text text-transparent mb-6">
              {t("loans-title") || "Agricultural Loans Made Simple"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("loans-description") || "Compare rates, get instant approvals, and grow your farming business with our comprehensive loan solutions."}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">{t("rates-from")}</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{t("quick-approval")}</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{t("secure-process")}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16">
        {/* Loan Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">{t("choose-loan-type")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.id ? 'ring-2 ring-foliage' : ''
                }`}
              >
                <GlassCard className="h-full p-6 text-center hover:bg-white/90">
                  <div className="text-foliage mb-4 flex justify-center">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t(category.nameKey)}</h3>
                  <p className="text-gray-600 text-sm mb-4">{t(category.descriptionKey)}</p>
                  <div className="text-sm text-foliage font-medium">
                    {category.minRate}% - {category.maxRate}%
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1 justify-center">
                    {category.featuresKeys.slice(0, 2).map((featureKey, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {t(featureKey)}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              {t("browse")}
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t("calculator")}
            </TabsTrigger>
            <TabsTrigger value="eligibility" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              {t("eligibility")}
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              {t("compare")} ({comparisonBanks.length})
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("apply")}
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {t("faq")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-8">
            {/* Country Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="country-picker" className="text-sm font-medium">
                    {t("select-country")}:
                  </label>
                  <select
                    id="country-picker"
                    className="border rounded-lg py-2 px-3 bg-white/80 backdrop-blur-sm"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  >
                    {countries.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </GlassCard>
            </motion.div>

            {/* Bank Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banksForCountry.map((bank, index) => (
                <motion.div
                  key={bank.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ModernBankCard
                    bank={bank}
                    onAddToComparison={() => addToComparison(bank)}
                    isInComparison={comparisonBanks.some(b => b.name === bank.name)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculator">
            <EnhancedLoanCalculator
              loanAmount={loanAmount}
              setLoanAmount={setLoanAmount}
              loanTenure={loanTenure}
              setLoanTenure={setLoanTenure}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
            />
          </TabsContent>

          <TabsContent value="eligibility">
            <EligibilityChecker />
          </TabsContent>

          <TabsContent value="compare">
            <LoanComparison
              banks={comparisonBanks}
              onRemove={removeFromComparison}
            />
          </TabsContent>

          <TabsContent value="apply">
            <LoanApplicationWizard />
          </TabsContent>

          <TabsContent value="faq">
            <LoanFAQ />
          </TabsContent>
        </Tabs>

        {/* Success Stories */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">{t("success-stories")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < story.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{story.story}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-foliage font-medium">₹{story.loanAmount.toLocaleString()}</span>
                    <span className="text-gray-600">{story.purpose}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        onCalculatorClick={() => setActiveTab("calculator")}
        onApplyClick={() => setActiveTab("apply")}
      />
    </div>
  );
}
