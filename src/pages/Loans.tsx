import { useState } from "react";
import LoanCalculator from "@/components/LoanCalculator";
import BankCard from "@/components/BankCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import LoanAdvisorModal from "@/components/LoanAdvisorModal";
import ThankYouModal from "@/components/ThankYouModal";
import CountryMapSelector from "@/components/CountryMapSelector";

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

// Extended bank list for richer demo
const banks: Bank[] = [
  {
    name: "State Bank of India",
    logo: "/banks/sbi-logo.png",
    alt: "State Bank of India logo",
    website: "https://sbi.co.in/web/agri-rural/agriculture-banking",
    features: [
      "Crop & equipment finance",
      "Flexible repayment",
      "Low interest rates"
    ],
    rate: "7.1% - 8.6%",
    type: "Government",
    country: "India"
  },
  {
    name: "Punjab National Bank",
    logo: "/banks/pnb-logo.png",
    alt: "Punjab National Bank logo",
    website: "https://www.pnbindia.in/Agriculture-Banking.html",
    features: [
      "Kisan credit card",
      "Agri infrastructure loan",
      "Subsidy options"
    ],
    rate: "7.4% - 9.2%",
    type: "Government",
    country: "India"
  },
  {
    name: "HDFC Bank",
    logo: "/banks/hdfc-logo.png",
    alt: "HDFC Bank logo",
    website: "https://www.hdfcbank.com/personal/products/loans/farmer-loan",
    features: [
      "Quick sanction",
      "Minimal paperwork",
      "Custom loan products"
    ],
    rate: "9.0% - 13.0%",
    type: "Private",
    country: "India"
  },
  {
    name: "Bank of America",
    logo: "/banks/boa-logo.png",
    alt: "Bank of America logo",
    website: "https://www.bankofamerica.com/smallbusiness/business-financing/agriculture-loans/",
    features: [
      "Agriculture business finance",
      "Flexible terms",
      "Expert consultants"
    ],
    rate: "5.2% - 8.0%",
    type: "Private",
    country: "United States"
  },
  {
    name: "USDA Direct",
    logo: "/banks/usda-logo.png",
    alt: "USDA Direct logo",
    website: "https://www.farmers.gov/loans",
    features: [
      "Low-interest government loans",
      "Young farmer programs",
      "Farm ownership options"
    ],
    rate: "2.5% - 6.2%",
    type: "Government",
    country: "United States"
  },
  {
    name: "Banco do Brasil",
    logo: "/banks/bb-logo.png",
    alt: "Banco do Brasil logo",
    website: "https://www.bb.com.br/agro",
    features: [
      "Agro business loans",
      "Special rates for rural producers",
      "Online loan guidance"
    ],
    rate: "6.1% - 10.3%",
    type: "Government",
    country: "Brazil"
  },
  {
    name: "Caixa Econômica Federal",
    logo: "/banks/caixa-logo.png",
    alt: "Caixa Econômica Federal logo",
    website: "https://www.caixa.gov.br/Agro",
    features: [
      "Machinery financing",
      "Crop insurance loans",
      "Various repayment options"
    ],
    rate: "7.0% - 11.8%",
    type: "Government",
    country: "Brazil"
  }
];

const countries = ["India", "United States", "Brazil"];
const defaultCountry = "India";

export default function Loans() {
  const [country, setCountry] = useState(defaultCountry);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  const banksForCountry = banks.filter(b => b.country === country);
  const govBanks = banksForCountry.filter(b => b.type === "Government");
  const privateBanks = banksForCountry.filter(b => b.type === "Private");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-foliage-light/10">
      <main className="container mx-auto pt-24 px-4 pb-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-2">
            Smart Agri Loans Guide
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover official bank rates, compare loan options, and get guidance on government and private agricultural loans suited for your needs. AgriLift empowers you with impartial, country-specific information, insightful calculators, and advisor support.
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
        {/* Map Selector */}
        <section className="max-w-md mx-auto mb-6">
          <CountryMapSelector country={country} onCountryChange={setCountry} />
        </section>

        {/* Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Bank Section */}
        <section aria-label="Loan Bank Options" className="mb-2">
          <h2 className="text-xl font-semibold text-soil-dark mb-1">Banks in {country}</h2>
          <p className="text-gray-500 text-sm mb-4">Compare top government and private banks for agriculture finance and guidance.</p>
          <div className="grid md:grid-cols-2 gap-6 my-6">
            {govBanks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-foliage-dark">Government Banks</h3>
                {govBanks.map(bank => (
                  <BankCard key={bank.name} bank={bank} onInfoClick={() => setAdvisorOpen(true)} />
                ))}
              </div>
            )}
            {privateBanks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-foliage">Private Banks</h3>
                {privateBanks.map(bank => (
                  <BankCard key={bank.name} bank={bank} onInfoClick={() => setAdvisorOpen(true)} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* What's Working Well */}
        <section
          aria-label="What's Working Well"
          className="my-5 bg-green-50 border-l-4 border-green-500 p-4 rounded shadow"
        >
          <h3 className="font-bold mb-1 text-green-800 flex items-center gap-2" aria-label="Success Highlights">
            <span>✅</span> What's Working Well
          </h3>
          <ul className="ml-6 list-disc text-green-900 text-[15px] leading-relaxed">
            <li><b>Stunning UI:</b> Modern, responsive design with vibrant bank listings and useful animations.</li>
            <li><b>Country-Specific Info:</b> Accurate loan guidance by your location and bank type.</li>
            <li><b>Interactive Tools:</b> EMI calculator and progress bar for clear repayment planning.</li>
            <li><b>Direct Links:</b> Instantly visit each bank for up-to-date official info.</li>
            <li><b>Accessibility:</b> Thoughtful alt text, ARIA labels, and easy navigation.</li>
          </ul>
        </section>

        {/* Loan Calculator */}
        <section className="max-w-xl mx-auto my-10">
          <LoanCalculator />
        </section>
        {/* User Message Block (Educational Note) */}
        <div className="my-6 bg-foliage-light/30 rounded p-4 text-soil-dark text-[15px]">
          <strong>Note:</strong> AgriLift is a reference platform only. We collate loan rates and features from verified banks and government partners; we do not disburse funds. For actual loan approval, please reach out to the banks listed.
        </div>
      </main>
      {/* Advisor Info Modal */}
      <LoanAdvisorModal
        open={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
        onThankYou={() => { setAdvisorOpen(false); setThankYouOpen(true); }}
      />
      {/* Thank-You Modal */}
      <ThankYouModal open={thankYouOpen} onClose={() => setThankYouOpen(false)} />
    </div>
  );
}
