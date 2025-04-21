
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import LoanCalculator from "@/components/LoanCalculator";
import BankCard from "@/components/BankCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import LoanAdvisorModal from "@/components/LoanAdvisorModal";
import ThankYouModal from "@/components/ThankYouModal";
import { Button } from "@/components/ui/button";

type Bank = {
  name: string;
  logo: string;
  alt: string;
  website: string;
  features: string[];
  rate: string;
  type: "Government" | "Private";
  country: string;
};

const banks: Bank[] = [
  {
    name: "State Bank of India",
    logo: "https://1000logos.net/wp-content/uploads/2021/05/State-Bank-of-India-logo.png",
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
  },
  {
    name: "Punjab National Bank",
    logo: "https://1000logos.net/wp-content/uploads/2021/06/Punjab-National-Bank-logo.png",
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
  },
  {
    name: "HDFC Bank",
    logo: "https://companieslogo.com/img/orig/HDB-bddb8c0d.png?t=1604060686",
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
  },
  {
    name: "Bank of Baroda",
    logo: "https://1000logos.net/wp-content/uploads/2021/10/Bank-of-Baroda-logo.png",
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
  },
  {
    name: "ICICI Bank",
    logo: "https://download.logo.wine/logo/ICICI_Bank/ICICI_Bank-Logo.wine.png",
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
  },
  {
    name: "Bank of America",
    logo: "https://1000logos.net/wp-content/uploads/2017/06/Bank-of-America-Logo-1920x1080.png",
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
  },
  {
    name: "Wells Fargo",
    logo: "https://1000logos.net/wp-content/uploads/2017/06/Wells-Fargo-logo.png",
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
  },
  {
    name: "Rabobank",
    logo: "https://1000logos.net/wp-content/uploads/2021/11/Rabobank-logo.png",
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
  },
  {
    name: "Caixa Econômica Federal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Caixa_logo.png/320px-Caixa_logo.png",
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
  },
  {
    name: "Banco do Brasil",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Banco_do_Brasil_logo.svg",
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
  }
];

const countries = ["India", "United States", "Brazil"];
const defaultCountry = "India";

export default function Loans() {
  const [country, setCountry] = useState(defaultCountry);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  // Placeholder for Leaflet country selection map.
  // For full integration, add: import { MapContainer, TileLayer, ... } from 'react-leaflet';
  // and install leaflet/react-leaflet. Using basic dropdown for now.
  
  const banksForCountry = banks.filter((b) => b.country === country);
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-foliage-light/10">
      <Navbar />
      <main className="container mx-auto pt-24 px-4 pb-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-2">Smart Agri Loans Guide</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover official bank rates, compare loan options, and get guidance on government and private agricultural loans suited for your needs.
          </p>
        </div>

        {/* Country Selector */}
        <section aria-label="Select your country" className="mb-2">
          <label htmlFor="country-picker" className="text-sm font-medium mr-2">Country:</label>
          <select
            id="country-picker"
            className="border rounded py-1 px-2"
            aria-label="Choose country for loan info"
            value={country}
            onChange={e => setCountry(e.target.value)}
          >
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
        </section>

        {/* Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Bank Cards */}
        <section aria-label="Loan Bank Options">
          <div className="grid md:grid-cols-2 gap-6 my-6">
            {banksForCountry.map((bank, idx) => (
              <BankCard
                key={bank.name}
                bank={bank}
                onInfoClick={() => setAdvisorOpen(true)}
              />
            ))}
          </div>
        </section>

        {/* User Message Block (Educational Note) */}
        <div className="my-6 bg-foliage-light/30 rounded p-4 text-soil-dark text-[15px]">
          <strong>Note:</strong> AgriLift is a reference platform only. We collate loan rates and features from verified banks and government partners; we do not disburse funds. For actual loan approval, please reach out to the banks listed.
        </div>

        {/* Loan Calculator */}
        <section className="max-w-xl mx-auto my-10">
          <LoanCalculator />
        </section>
      </main>
      {/* Advisor Info Modal */}
      <LoanAdvisorModal open={advisorOpen} onClose={() => setAdvisorOpen(false)} onThankYou={() => { setAdvisorOpen(false); setThankYouOpen(true); }} />
      {/* Thank-You Modal */}
      <ThankYouModal open={thankYouOpen} onClose={() => setThankYouOpen(false)} />
    </div>
  );
}
