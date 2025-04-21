
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
    logo: "/banks/sbi-logo.png",
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
    logo: "/banks/pnb-logo.png",
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
    logo: "/banks/hdfc-logo.png",
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
  // ... add more as needed ...
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
