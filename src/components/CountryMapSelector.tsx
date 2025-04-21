
import React from "react";

export default function CountryMapSelector({
  country,
  onCountryChange
}: {
  country: string;
  onCountryChange: (c: string) => void;
}) {
  // Placeholder visual only
  return (
    <div className="rounded-lg border bg-white shadow p-4 text-center" aria-label="Interactive country map (placeholder)">
      <div className="mb-2 text-sm">Interactive Map (Coming Soon)</div>
      <div className="flex justify-center items-center min-h-[120px] text-foliage-dark/60">
        [Map will be shown here]
      </div>
      <div className="mt-2">
        <span className="text-xs text-gray-500">Select your country in the dropdown above.</span>
      </div>
    </div>
  );
}
