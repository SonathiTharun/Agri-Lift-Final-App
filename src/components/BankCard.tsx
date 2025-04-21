
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function BankCard({
  bank,
  onInfoClick
}: {
  bank: {
    name: string;
    logo: string;
    alt: string;
    website: string;
    features: string[];
    rate: string;
    type: string;
    country: string;
  };
  onInfoClick: () => void;
}) {
  return (
    <div className="rounded-lg border shadow p-4 bg-white">
      <div className="flex gap-3 items-center mb-2">
        <img src={bank.logo} alt={bank.alt} width={48} height={48} className="rounded bg-gray-100" />
        <div>
          <h3 className="font-semibold text-xl">{bank.name}</h3>
          <span className="text-xs text-gray-500">{bank.type} • {bank.country}</span>
        </div>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        <strong>Rate:</strong> {bank.rate}
      </div>
      <div className="mb-3">
        {bank.features.map((f, i) => (
          <span key={f} className="block text-xs text-gray-600">
            ✅ {f}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Button aria-label="Learn more about this loan" onClick={onInfoClick} variant="secondary">
          Get Info
        </Button>
        <a
          href={bank.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-foliage-dark text-xs px-3 py-1 border border-foliage-dark rounded-md hover:bg-foliage-dark hover:text-white transition"
          aria-label={`Visit the website for ${bank.name}`}
        >
          Visit Site
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
    </div>
  );
}
