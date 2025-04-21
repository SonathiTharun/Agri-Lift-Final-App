
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(8.0);

  // EMI formula, basic version for educational purposes
  function calcEMI(p: number, n: number, r: number) {
    let monthlyRate = r / 12 / 100;
    let totalMonths = n * 12;
    return (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
  const emi = calcEMI(amount, years, rate);
  const totalRepay = emi * years * 12;
  const interest = totalRepay - amount;

  return (
    <div className="rounded-lg bg-white px-5 py-6 shadow border mb-6">
      <h2 className="text-lg font-semibold mb-2">Loan Repayment Calculator</h2>
      <p className="text-xs text-gray-500 mb-3">Estimate EMI, total repayment, and interest for your desired loan.</p>
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="loan-amt" className="block text-sm font-medium">Loan Amount</label>
          <input
            id="loan-amt"
            type="range"
            min={50000}
            max={1000000}
            step={10000}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full mb-1"
            aria-valuenow={amount}
            aria-valuemin={50000}
            aria-valuemax={1000000}
            aria-label="Select loan amount"
          />
          <span className="text-xs">₹{amount.toLocaleString()}</span>
        </div>
        <div>
          <label htmlFor="loan-years" className="block text-sm font-medium">Years</label>
          <input
            id="loan-years"
            type="number"
            min={1}
            max={15}
            value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="w-16 ml-2 border"
            aria-label="Select loan duration (years)"
          />
        </div>
        <div>
          <label htmlFor="loan-rate" className="block text-sm font-medium">Annual Rate (%)</label>
          <input
            id="loan-rate"
            type="number"
            step={0.1}
            min={4}
            max={20}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-16 ml-2 border"
            aria-label="Select interest rate"
          />
        </div>
        {/* Progress Bar */}
        <div className="flex items-center mt-2">
          <div className="bg-foliage-light h-2 rounded w-full mr-2">
            <div
              className="bg-foliage-dark h-2 rounded"
              style={{ width: Math.max(5, Math.min(100, (amount - 50000) / 950000 * 100)) + "%" }}
              aria-valuenow={(amount - 50000) / 950000 * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-xs">{Math.round((amount - 50000) / 950000 * 100)}%</span>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex gap-4 flex-wrap">
        <span className="text-sm font-semibold">EMI: ₹{emi ? emi.toFixed(2) : "--"}</span>
        <span className="text-sm">Interest: ₹{interest ? interest.toFixed(2) : "--"}</span>
        <span className="text-sm">Total Repayment: ₹{totalRepay ? totalRepay.toFixed(2) : "--"}</span>
      </div>
    </div>
  );
}
